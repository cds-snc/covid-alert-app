import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_CODE} from 'env';
import PQueue from 'p-queue';
import {Platform} from 'react-native';
import {Status} from 'screens/home/components/NotificationPermissionStatus';
import {ExposureStatus, ExposureStatusType, SystemStatus} from 'services/ExposureNotificationService';
import {Key} from 'services/StorageService';
import {getHoursBetween, getCurrentDate, daysBetweenUTC, getUTCMidnight} from 'shared/date-fns';

import {DefaultFilteredMetricsStateStorage, FilteredMetricsStateStorage} from './FilteredMetricsStateStorage';
import {Metric} from './Metric';
import {DefaultMetricsJsonSerializer} from './MetricsJsonSerializer';
import {DefaultMetricsService, MetricsService} from './MetricsService';
import {DefaultSecureKeyValueStore} from './SecureKeyValueStorage';

export enum EventTypeMetric {
  Installed = 'installed',
  Onboarded = 'onboarded',
  Exposed = 'exposed',
  OtkNoDate = 'otk-no-date',
  OtkWithDate = 'otk-with-date',
  EnToggle = 'en-toggle',
  ExposedClear = 'exposed-clear',
  BackgroundCheck = 'background-check',
  ActiveUser = 'active-user',
}

export type EventWithContext =
  | {
      type: EventTypeMetric.Installed;
    }
  | {
      type: EventTypeMetric.Onboarded;
    }
  | {
      type: EventTypeMetric.Exposed;
    }
  | {
      type: EventTypeMetric.OtkNoDate;
      exposureHistory: number[];
    }
  | {
      type: EventTypeMetric.OtkWithDate;
    }
  | {
      type: EventTypeMetric.EnToggle;
      state: boolean;
      onboardedDate: Date | undefined;
    }
  | {
      type: EventTypeMetric.ExposedClear;
      exposureStatus: ExposureStatus;
    }
  | {
      type: EventTypeMetric.BackgroundCheck;
    }
  | {
      type: EventTypeMetric.ActiveUser;
    };

export class FilteredMetricsService {
  private static instance: FilteredMetricsService;

  static sharedInstance(): FilteredMetricsService {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private metricsService: MetricsService;
  private stateStorage: FilteredMetricsStateStorage;

  private serialPromiseQueue: PQueue;

  private constructor() {
    this.metricsService = DefaultMetricsService.initialize(
      new DefaultMetricsJsonSerializer(String(APP_VERSION_CODE), Platform.OS, String(Platform.Version)),
    );
    this.stateStorage = new DefaultFilteredMetricsStateStorage(new DefaultSecureKeyValueStore());
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  addEvent(eventWithContext: EventWithContext): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      switch (eventWithContext.type) {
        case EventTypeMetric.Installed:
          return this.publishInstalledEventIfNecessary();
        case EventTypeMetric.Onboarded:
          return this.stateStorage.markOnboardedEventShouldBePublished();
        case EventTypeMetric.Exposed:
          return this.publishEvent(EventTypeMetric.Exposed, []);
        case EventTypeMetric.OtkNoDate:
          if (eventWithContext.exposureHistory.length > 0) {
            return this.publishEvent(EventTypeMetric.OtkNoDate, []);
          }
          break;
        case EventTypeMetric.OtkWithDate:
          return this.publishEvent(EventTypeMetric.OtkWithDate, []);
        case EventTypeMetric.EnToggle:
          return this.publishEnToggleEventIfNecessary(eventWithContext.state, eventWithContext.onboardedDate);
        case EventTypeMetric.ExposedClear:
          if (eventWithContext.exposureStatus.type === ExposureStatusType.Exposed) {
            return this.publishEvent(EventTypeMetric.ExposedClear, [
              [
                'hoursSinceExposureDetectedAt',
                String(getHoursBetween(getCurrentDate(), new Date(eventWithContext.exposureStatus.exposureDetectedAt))),
              ],
            ]);
          }
          break;
        case EventTypeMetric.BackgroundCheck:
          return this.publishBackgroundCheckEventIfNecessary();
        case EventTypeMetric.ActiveUser:
          return this.publishActiveUserEventIfNecessary();
        default:
          break;
      }

      return Promise.resolve();
    });
  }

  sendDailyMetrics(systemStatus: SystemStatus, notificationStatus: Status): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      return this.publishOnboardedEventIfNecessary(
        String(notificationStatus),
        String(systemStatus === SystemStatus.Active),
      ).then(() => this.metricsService.sendDailyMetrics());
    });
  }

  retrieveAllMetricsInStorage(): Promise<Metric[]> {
    return this.serialPromiseQueue.add(() => {
      return this.metricsService.retrieveAllMetricsInStorage();
    });
  }

  private publishInstalledEventIfNecessary(): Promise<void> {
    const publishAndMark = (): Promise<void> => {
      return this.publishEvent(EventTypeMetric.Installed, [], true).then(() =>
        this.stateStorage.markInstalledEventAsPublished(),
      );
    };
    return this.stateStorage.isInstalledEventPublished().then(isPublished => {
      if (isPublished === false) {
        return publishAndMark();
      }
    });
  }

  private publishOnboardedEventIfNecessary(notificationStatus: string, frameworkenabled: string): Promise<void> {
    const publishAndMark = (): Promise<void> => {
      return this.publishEvent(EventTypeMetric.Onboarded, [
        ['pushnotification', notificationStatus],
        ['frameworkenabled', frameworkenabled],
      ]).then(() => this.stateStorage.markOnboardedEventShouldNotBePublished());
    };
    return this.stateStorage.shouldOnboardedEventBePublished().then(shouldPublish => {
      if (shouldPublish) {
        return publishAndMark();
      }
    });
  }

  private publishEnToggleEventIfNecessary(state: boolean, onboardedDate: Date | undefined): Promise<void> {
    function shouldPublishEnToggle(): boolean {
      if (!state) return true;
      if (onboardedDate && getHoursBetween(onboardedDate, getCurrentDate()) > 24) {
        return true;
      } else {
        return false;
      }
    }

    if (shouldPublishEnToggle()) {
      return this.publishEvent(EventTypeMetric.EnToggle, [['state', String(state)]]);
    } else {
      return Promise.resolve();
    }
  }

  private publishBackgroundCheckEventIfNecessary(): Promise<void> {
    const publishAndSave = (
      numberOfBackgroundCheckForPreviousDay: number,
      day: number,
      newBackgroundCheckEvent: Date,
    ): Promise<void> => {
      return this.publishEvent(EventTypeMetric.BackgroundCheck, [
        ['count', String(numberOfBackgroundCheckForPreviousDay)],
        ['utcDay', String(day)],
      ]).then(() => this.stateStorage.saveBackgroundCheckEvents([newBackgroundCheckEvent]));
    };

    const newBackgroundCheckEvent = getCurrentDate();

    return this.stateStorage.getBackgroundCheckEvents().then(events => {
      if (events.length > 0) {
        const lastBackgroundCheckEvent = events[events.length - 1];
        if (daysBetweenUTC(lastBackgroundCheckEvent, newBackgroundCheckEvent) === 0) {
          return this.stateStorage.saveBackgroundCheckEvents(events.concat(newBackgroundCheckEvent));
        } else {
          return publishAndSave(events.length, getUTCMidnight(events[0]), newBackgroundCheckEvent);
        }
      } else {
        return this.stateStorage.saveBackgroundCheckEvents([newBackgroundCheckEvent]);
      }
    });
  }

  private publishActiveUserEventIfNecessary(): Promise<void> {
    const publishAndMark = (): Promise<void> => {
      return this.publishEvent(EventTypeMetric.ActiveUser, []).then(() =>
        this.stateStorage.updateLastActiveUserSentDateToNow(),
      );
    };

    return this.stateStorage.getLastActiveUserEventSentDate().then(lastActiveUserEventSentDate => {
      if (lastActiveUserEventSentDate) {
        if (daysBetweenUTC(lastActiveUserEventSentDate, getCurrentDate()) > 0) {
          return publishAndMark();
        }
      } else {
        return publishAndMark();
      }
    });
  }

  private async publishEvent(
    eventType: EventTypeMetric,
    metricPayload: [string, string][],
    forcePushToServer = false,
  ): Promise<void> {
    const region = await this.getRegion();
    return this.metricsService.publishMetric(
      new Metric(getCurrentDate().getTime(), eventType, region, metricPayload),
      forcePushToServer,
    );
  }

  private async getRegion(): Promise<string> {
    const regionOpt = await AsyncStorage.getItem(Key.Region);
    return regionOpt ? regionOpt : 'None';
  }
}
