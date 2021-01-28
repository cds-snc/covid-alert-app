import {APP_VERSION_CODE} from 'env';
import PQueue from 'p-queue';
import {Platform} from 'react-native';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';
import {
  ExposureStatusType,
  SystemStatus,
  useExposureStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
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

  addEvent(eventType: EventTypeMetric): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      const exposureStatus = useExposureStatus();
      const {region, userStopped} = useStorage();

      switch (eventType) {
        case EventTypeMetric.Installed:
          return this.publishInstalledEventIfNecessary(region);
        case EventTypeMetric.Exposed:
          return this.publishEvent(EventTypeMetric.Exposed, [], region);
        case EventTypeMetric.Onboarded:
          return this.stateStorage.markOnboardedEventShouldBePublished();
        case EventTypeMetric.OtkNoDate:
          if (exposureStatus.type === ExposureStatusType.Exposed) {
            return this.publishEvent(EventTypeMetric.OtkNoDate, [], region);
          }
          break;
        case EventTypeMetric.OtkWithDate:
          return this.publishEvent(EventTypeMetric.OtkWithDate, [], region);
        case EventTypeMetric.EnToggle:
          return this.publishEvent(EventTypeMetric.EnToggle, [['state', String(userStopped)]], region);
        case EventTypeMetric.ExposedClear:
          if (exposureStatus.type === ExposureStatusType.Exposed) {
            return this.publishEvent(
              EventTypeMetric.ExposedClear,
              [
                [
                  'hoursSinceExposureDetectedAt',
                  String(getHoursBetween(getCurrentDate(), new Date(exposureStatus.exposureDetectedAt))),
                ],
              ],
              region,
            );
          }
          break;
      }

      return Promise.resolve();
    });
  }

  sendDailyMetrics(): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      const [systemStatus] = useSystemStatus();
      const [notificationStatus] = useNotificationPermissionStatus();
      const {region} = useStorage();
      return this.publishOnboardedEventIfNecessary(
        String(notificationStatus),
        String(systemStatus === SystemStatus.Active),
        region,
      ).then(() => this.metricsService.sendDailyMetrics());
    });
  }

  private publishInstalledEventIfNecessary(region?: string): Promise<void> {
    const publishAndMark = (): Promise<void> => {
      return this.publishEvent(EventTypeMetric.Installed, [], region, true).then(() =>
        this.stateStorage.markInstalledEventAsPublished(),
      );
    };
    return this.stateStorage.isInstalledEventPublished().then(isPublished => {
      if (isPublished === false) {
        return publishAndMark();
      }
    });
  }

  private publishOnboardedEventIfNecessary(
    notificationStatus: string,
    frameworkenabled: string,
    region?: string,
  ): Promise<void> {
    const publishAndMark = (): Promise<void> => {
      return this.publishEvent(
        EventTypeMetric.Onboarded,
        [
          ['pushnotification', notificationStatus],
          ['frameworkenabled', frameworkenabled],
        ],
        region,
      ).then(() => this.stateStorage.markOnboardedEventShouldNotBePublished());
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
    region?: string,
    forcePushToServer = false,
  ): Promise<void> {
    return this.metricsService.publishMetric(
      new Metric(new Date().getTime(), eventType, region ?? 'None', metricPayload),
      forcePushToServer,
    );
  }
}
