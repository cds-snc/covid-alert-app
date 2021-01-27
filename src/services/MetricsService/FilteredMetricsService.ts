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

import {Metric} from './Metric';
import {DefaultMetricsJsonSerializer} from './MetricsJsonSerializer';
import {DefaultMetricsService, MetricsService} from './MetricsService';

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

  private serialPromiseQueue: PQueue;

  private constructor() {
    this.metricsService = DefaultMetricsService.initialize(
      new DefaultMetricsJsonSerializer(String(APP_VERSION_CODE), Platform.OS),
    );
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  addEvent(eventType: EventTypeMetric, forcePushToServer = false): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      const exposureStatus = useExposureStatus();
      const {region, userStopped} = useStorage();
      const [systemStatus] = useSystemStatus();
      const [notificationStatus] = useNotificationPermissionStatus();

      let newMetricPayload: [string, string][] = [];

      switch (eventType) {
        case EventTypeMetric.Installed:
        case EventTypeMetric.Exposed:
          break;
        case EventTypeMetric.Onboarded:
          newMetricPayload = [
            ['pushnotification', String(notificationStatus)],
            ['frameworkenabled', String(systemStatus === SystemStatus.Active)],
          ];
          break;
        case EventTypeMetric.OtkNoDate:
        case EventTypeMetric.OtkWithDate:
          break;
        case EventTypeMetric.EnToggle:
          newMetricPayload = [['state', String(userStopped)]];
          break;
        case EventTypeMetric.ExposedClear:
          if (exposureStatus.type !== ExposureStatusType.Exposed) {
            break;
          }
          newMetricPayload = [
            [
              'hoursSinceExposureDetectedAt',
              String(getHoursBetween(getCurrentDate(), new Date(exposureStatus.exposureDetectedAt))),
            ],
          ];
          break;
      }

      return this.metricsService.publishMetric(
        new Metric(new Date().getTime(), eventType, region ?? 'None', newMetricPayload),
        forcePushToServer,
      );
    });
  }

  sendDailyMetrics(): Promise<void> {
    return this.metricsService.sendDailyMetrics();
  }
}
