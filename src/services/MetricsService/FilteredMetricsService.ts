import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_VERSION_CODE} from 'env';
import PQueue from 'p-queue';
import {Platform} from 'react-native';
import {Status} from 'shared/NotificationPermissionStatus';
import {SystemStatus} from 'services/ExposureNotificationService';
import {Key} from 'services/StorageService';
import {getCurrentDate} from 'shared/date-fns';
import {SecureKeyValueStore} from 'services/StorageService/KeyValueStore';

import {Metric} from './Metric';
import {DefaultMetricsFilter, EventTypeMetric, EventWithContext, MetricsFilter} from './MetricsFilter';
import {DefaultMetricsJsonSerializer} from './MetricsJsonSerializer';
import {DefaultMetricsService, MetricsService} from './MetricsService';

export class FilteredMetricsService {
  private static instance: FilteredMetricsService;

  static sharedInstance(): FilteredMetricsService {
    if (!this.instance) {
      const [manufacturer, model, androidReleaseVersion] = getManufacturerWithModelAndAndroidReleaseVersion();
      this.instance = new this(
        DefaultMetricsService.initialize(
          new DefaultMetricsJsonSerializer(
            String(APP_VERSION_CODE),
            Platform.OS,
            String(Platform.Version),
            manufacturer,
            model,
            androidReleaseVersion,
          ),
        ),
        new DefaultMetricsFilter(new SecureKeyValueStore()),
      );
    }
    return this.instance;
  }

  private metricsService: MetricsService;
  private metricsFilter: MetricsFilter;

  private serialPromiseQueue: PQueue;

  constructor(metricsService: MetricsService, metricsFilter: MetricsFilter) {
    this.metricsService = metricsService;
    this.metricsFilter = metricsFilter;

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

function getManufacturerWithModelAndAndroidReleaseVersion(): [string, string, string] {
  try {
    if (Platform.OS === 'android') {
      // @ts-ignore
      const fingerprintFromPlatformConstants = String(Platform.constants.Fingerprint);
      const manufacturer = fingerprintFromPlatformConstants.split('/')[0];
      // @ts-ignore
      const model = String(Platform.constants.Model);
      // @ts-ignore
      const androidReleaseVersion = String(Platform.constants.Release);
      return [manufacturer, model, androidReleaseVersion];
    } else {
      return ['Apple', 'unavailable', 'unavailable'];
    }
  } catch (error) {
    return ['unavailable', 'unavailable', 'unavailable'];
  }
}
