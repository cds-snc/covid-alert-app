import {METRICS_API_KEY, METRICS_URL} from 'env';
import PQueue from 'p-queue';
import {log} from 'shared/logging/config';
import {daysBetweenUTC, getCurrentDate} from 'shared/date-fns';
import {DefaultStorageService, StorageService, StorageDirectory} from 'services/StorageService';

import {Metric} from './Metric';
import {MetricsJsonSerializer} from './MetricsJsonSerializer';
import {DefaultMetricsProvider, MetricsProvider} from './MetricsProvider';
import {DefaultMetricsPublisher, MetricsPublisher} from './MetricsPublisher';
import {DefaultMetricsPusher, MetricsPusher, MetricsPusherResult} from './MetricsPusher';
import {DefaultMetricsStorage, MetricsStorageCleaner} from './MetricsStorage';
import {InactiveMetricsService} from './InactiveMetricsService';

export interface MetricsServiceDebug {
  retrieveAllMetricsInStorage(): Promise<Metric[]>;
}

export interface MetricsService extends MetricsServiceDebug {
  publishMetric(metric: Metric, forcePush?: boolean): Promise<void>;
  publishMetrics(metrics: Metric[], forcePush?: boolean): Promise<void>;
  sendDailyMetrics(): Promise<void>;
}

enum TriggerPushResult {
  Success,
  Error,
  NoData,
}

export class DefaultMetricsService implements MetricsService {
  static initialize(metricsJsonSerializer: MetricsJsonSerializer): MetricsService {
    if (METRICS_URL) {
      const storageService = DefaultStorageService.sharedInstance();
      const metricsStorage = new DefaultMetricsStorage(storageService);
      const metricsPublisher = new DefaultMetricsPublisher(metricsStorage);
      const metricsProvider = new DefaultMetricsProvider(metricsStorage);
      const metricsPusher = new DefaultMetricsPusher(METRICS_URL, METRICS_API_KEY);
      return new DefaultMetricsService(
        storageService,
        metricsPublisher,
        metricsProvider,
        metricsStorage,
        metricsJsonSerializer,
        metricsPusher,
      );
    } else {
      return new InactiveMetricsService();
    }
  }

  private storageService: StorageService;
  private metricsPublisher: MetricsPublisher;
  private metricsProvider: MetricsProvider;
  private metricsStorageCleaner: MetricsStorageCleaner;
  private metricsJsonSerializer: MetricsJsonSerializer;
  private metricsPusher: MetricsPusher;

  private serialPromiseQueue: PQueue;

  constructor(
    storageService: StorageService,
    metricsPublisher: MetricsPublisher,
    metricsProvider: MetricsProvider,
    metricsStorageCleaner: MetricsStorageCleaner,
    metricsJsonSerializer: MetricsJsonSerializer,
    metricsPusher: MetricsPusher,
  ) {
    this.storageService = storageService;
    this.metricsPublisher = metricsPublisher;
    this.metricsProvider = metricsProvider;
    this.metricsStorageCleaner = metricsStorageCleaner;
    this.metricsJsonSerializer = metricsJsonSerializer;
    this.metricsPusher = metricsPusher;
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  publishMetric(metric: Metric, forcePush = false): Promise<void> {
    return this.publishMetrics([metric], forcePush);
  }

  publishMetrics(metrics: Metric[], forcePush = false): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      log.debug({
        category: 'debug',
        message: 'publishing new metrics',
        payload: metrics,
      });
      return this.metricsPublisher
        .publish(metrics)
        .then(() => {
          if (forcePush) {
            return this.triggerPush();
          }
        })
        .then(() => {});
    });
  }

  sendDailyMetrics(): Promise<void> {
    const pushAndMarkLastUploadedDateTime = (): Promise<void> => {
      return this.triggerPush().then(result => {
        if (result === TriggerPushResult.Success) {
          return this.markMetricsLastUploadedDateTime(getCurrentDate());
        }
      });
    };

    return this.serialPromiseQueue.add(() => {
      return this.getMetricsLastUploadedDateTime().then(metricsLastUploadedDateTime => {
        if (metricsLastUploadedDateTime) {
          const today = getCurrentDate();
          if (daysBetweenUTC(metricsLastUploadedDateTime, today) > 0) {
            return pushAndMarkLastUploadedDateTime();
          }
        } else {
          return pushAndMarkLastUploadedDateTime();
        }
      });
    });
  }

  retrieveAllMetricsInStorage(): Promise<Metric[]> {
    return this.serialPromiseQueue.add(() => {
      return this.metricsProvider.retrieveAll();
    });
  }

  private triggerPush(): Promise<TriggerPushResult> {
    const pushAndClearMetrics = (metrics: Metric[]): Promise<TriggerPushResult> => {
      const jsonAsString = this.metricsJsonSerializer.serializeToJson(getCurrentDate().getTime(), metrics);
      return Promise.all([this.metricsPusher.push(jsonAsString), Promise.resolve(metrics.pop())])
        .then(([pushResult, lastPushedMetric]) => {
          switch (pushResult) {
            case MetricsPusherResult.Success:
              return Promise.all([
                this.markLastMetricTimestampSentToTheServer(lastPushedMetric!.timestamp),
                this.metricsStorageCleaner.deleteUntilTimestamp(lastPushedMetric!.timestamp),
                Promise.resolve(TriggerPushResult.Success),
              ]);
            case MetricsPusherResult.Error:
            default:
              return Promise.all([Promise.resolve(), Promise.resolve(), Promise.resolve(TriggerPushResult.Error)]);
          }
        })
        .then(([, , result]) => result);
    };
    return this.getLastMetricTimestampSentToTheServer()
      .then(lastTimestamp => {
        if (lastTimestamp) {
          return this.metricsProvider.retrieveLaterThanTimestamp(lastTimestamp);
        } else {
          return this.metricsProvider.retrieveAll();
        }
      })
      .then(metrics => {
        if (metrics.length > 0) {
          return pushAndClearMetrics(metrics);
        } else {
          return TriggerPushResult.NoData;
        }
      });
  }

  private getLastMetricTimestampSentToTheServer(): Promise<number | null> {
    return this.storageService
      .retrieve(StorageDirectory.MetricsServiceLastMetricTimestampSentToTheServerKey)
      .then(value => (value ? Number(value) : null));
  }

  private markLastMetricTimestampSentToTheServer(timestamp: number): Promise<void> {
    return this.storageService.save(
      StorageDirectory.MetricsServiceLastMetricTimestampSentToTheServerKey,
      `${timestamp}`,
    );
  }

  private getMetricsLastUploadedDateTime(): Promise<Date | null> {
    return this.storageService
      .retrieve(StorageDirectory.MetricsServiceMetricsLastUploadedDateTimeKey)
      .then(value => (value ? new Date(Number(value)) : null));
  }

  private markMetricsLastUploadedDateTime(date: Date): Promise<void> {
    return this.storageService.save(StorageDirectory.MetricsServiceMetricsLastUploadedDateTimeKey, `${date.getTime()}`);
  }
}
