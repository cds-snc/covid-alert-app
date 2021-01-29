import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_CODE} from 'env';
import PQueue from 'p-queue';
import {Platform} from 'react-native';
import {Status} from 'screens/home/components/NotificationPermissionStatus';
import {ExposureStatus, ExposureStatusType, SystemStatus} from 'services/ExposureNotificationService';
import {Key} from 'services/StorageService';
import {getHoursBetween, getCurrentDate} from 'shared/date-fns';
import {log} from 'shared/logging/config';

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
      exposureStatus: ExposureStatus;
    }
  | {
      type: EventTypeMetric.OtkWithDate;
    }
  | {
      type: EventTypeMetric.EnToggle;
      state: boolean;
    }
  | {
      type: EventTypeMetric.ExposedClear;
      exposureStatus: ExposureStatus;
    };

export class FilteredMetricsService {
  private static instance: FilteredMetricsService;

  static sharedInstance(): FilteredMetricsService {
    if (!this.instance) {
      log.debug({
        category: 'debug',
        message: 'FilteredMetricsService shared instance initialized',
      });
      this.instance = new this();
    }
    return this.instance;
  }

  private metricsService: MetricsService;
  private stateStorage: FilteredMetricsStateStorage;

  private serialPromiseQueue: PQueue;

  private constructor() {
    this.metricsService = DefaultMetricsService.initialize(
      new DefaultMetricsJsonSerializer(String(APP_VERSION_CODE), Platform.OS),
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
          if (eventWithContext.exposureStatus.type === ExposureStatusType.Exposed) {
            return this.publishEvent(EventTypeMetric.OtkNoDate, []);
          }
          break;
        case EventTypeMetric.OtkWithDate:
          return this.publishEvent(EventTypeMetric.OtkWithDate, []);
        case EventTypeMetric.EnToggle:
          return this.publishEvent(EventTypeMetric.EnToggle, [['state', String(eventWithContext.state)]]);
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

  private publishEvent(
    eventType: EventTypeMetric,
    metricPayload: [string, string][],
    forcePushToServer = false,
  ): Promise<void> {
    return this.getRegion().then(region => {
      return this.metricsService.publishMetric(
        new Metric(new Date().getTime(), eventType, region, metricPayload),
        forcePushToServer,
      );
    });
  }

  private getRegion(): Promise<string> {
    return AsyncStorage.getItem(Key.Region).then(region => {
      if (region) {
        return region;
      } else {
        return 'None';
      }
    });
  }
}
