import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_CODE} from 'env';
import PQueue from 'p-queue';
import {Platform} from 'react-native';
import {Status} from 'screens/home/components/NotificationPermissionStatus';
import {SystemStatus} from 'services/ExposureNotificationService';
import {Key} from 'services/StorageService';
import {getCurrentDate} from 'shared/date-fns';

import {Metric} from './Metric';
import {DefaultMetricsFilter, EventTypeMetric, EventWithContext, MetricsFilter} from './MetricsFilter';
import {DefaultMetricsJsonSerializer} from './MetricsJsonSerializer';
import {DefaultMetricsService, MetricsService} from './MetricsService';
import {DefaultSecureKeyValueStore} from './SecureKeyValueStorage';

export class FilteredMetricsService {
  private static instance: FilteredMetricsService;

  static sharedInstance(): FilteredMetricsService {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private metricsService: MetricsService;
  private metricsFilter: MetricsFilter;

  private serialPromiseQueue: PQueue;

  private constructor() {
    this.metricsService = DefaultMetricsService.initialize(
      new DefaultMetricsJsonSerializer(String(APP_VERSION_CODE), Platform.OS, String(Platform.Version)),
    );
    this.metricsFilter = new DefaultMetricsFilter(new DefaultSecureKeyValueStore());
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  addEvent(eventWithContext: EventWithContext): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      return this.metricsFilter.filterEvent(eventWithContext).then(filteredEvent => {
        if (filteredEvent) {
          return this.publishEvent(
            filteredEvent.eventType,
            filteredEvent.payload,
            filteredEvent.shouldBePushedToServerRightAway,
          );
        }
      });
    });
  }

  sendDailyMetrics(systemStatus: SystemStatus, notificationStatus: Status): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      return this.metricsFilter
        .getDelayedOnboardedEventIfPublishable(String(notificationStatus), String(systemStatus === SystemStatus.Active))
        .then(filteredEvent => {
          if (filteredEvent) {
            return this.publishEvent(
              filteredEvent.eventType,
              filteredEvent.payload,
              filteredEvent.shouldBePushedToServerRightAway,
            );
          }
        })
        .then(() => this.metricsService.sendDailyMetrics());
    });
  }

  retrieveAllMetricsInStorage(): Promise<Metric[]> {
    return this.serialPromiseQueue.add(() => {
      return this.metricsService.retrieveAllMetricsInStorage();
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
