import PQueue from 'p-queue';
import {log} from 'shared/logging/config';

import {Metric} from './Metric';
import {MetricsJsonSerializer} from './MetricsJsonSerializer';
import {DefaultMetricsProvider, MetricsProvider} from './MetricsProvider';
import {DefaultMetricsPublisher, MetricsPublisher} from './MetricsPublisher';
import {DefaultMetricsPusher, MetricsPusher, MetricsPusherResult} from './MetricsPusher';
import {DefaultMetricsStorage, MetricsStorageCleaner} from './MetricsStorage';
import {DefaultSecureKeyValueStore, SecureKeyValueStore} from './SecureKeyValueStorage';

const LastMetricTimestampSentToTheServerUniqueIdentifier = '3FFE2346-1910-4FD7-A23F-52D83CFF083A';

export interface MetricsService {
  publishMetric(metric: Metric, forcePush?: boolean): Promise<void>;
  publishMetrics(metrics: Metric[], forcePush?: boolean): Promise<void>;
  sendMetrics(): Promise<void>;
}

export class DefaultMetricsService implements MetricsService {
  static initialize(metricsJsonSerializer: MetricsJsonSerializer): MetricsService {
    const secureKeyValueStore = new DefaultSecureKeyValueStore();
    const metricsStorage = new DefaultMetricsStorage(secureKeyValueStore);
    const metricsPublisher = new DefaultMetricsPublisher(metricsStorage);
    const metricsProvider = new DefaultMetricsProvider(metricsStorage);
    return new DefaultMetricsService(
      secureKeyValueStore,
      metricsPublisher,
      metricsProvider,
      metricsStorage,
      metricsJsonSerializer,
    );
  }

  private secureKeyValueStore: SecureKeyValueStore;
  private metricsPublisher: MetricsPublisher;
  private metricsProvider: MetricsProvider;
  private metricsStorageCleaner: MetricsStorageCleaner;
  private metricsJsonSerializer: MetricsJsonSerializer;

  private serialPromiseQueue: PQueue;

  private constructor(
    secureKeyValueStore: SecureKeyValueStore,
    metricsPublisher: MetricsPublisher,
    metricsProvider: MetricsProvider,
    metricsStorageCleaner: MetricsStorageCleaner,
    metricsJsonSerializer: MetricsJsonSerializer,
  ) {
    this.secureKeyValueStore = secureKeyValueStore;
    this.metricsPublisher = metricsPublisher;
    this.metricsProvider = metricsProvider;
    this.metricsStorageCleaner = metricsStorageCleaner;
    this.metricsJsonSerializer = metricsJsonSerializer;
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
      return this.metricsPublisher.publish(metrics).then(() => {
        if (forcePush) {
          return this.triggerPush();
        }
      });
    });
  }

  sendMetrics(): Promise<void> {
    return this.serialPromiseQueue.add(() => this.triggerPush());
  }

  private triggerPush(): Promise<void> {
    const pushAndClearMetrics = (metrics: Metric[]): Promise<void> => {
      const jsonAsString = this.metricsJsonSerializer.serializeToJson(metrics);
      const metricsPusher: MetricsPusher = new DefaultMetricsPusher(jsonAsString);
      return Promise.all([metricsPusher.push(), Promise.resolve(metrics.pop())])
        .then(([pushResult, lastPushedMetric]) => {
          switch (pushResult) {
            case MetricsPusherResult.Success:
              return this.markLastMetricTimestampSentToTheServer(lastPushedMetric!.timestamp);
            case MetricsPusherResult.Error:
              // Failed to send metrics to the server
              break;
          }
        })
        .then(() => this.clearStorageFromUnnecessaryMetrics());
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
        }
      });
  }

  private getLastMetricTimestampSentToTheServer(): Promise<number | null> {
    return this.secureKeyValueStore
      .retrieve(LastMetricTimestampSentToTheServerUniqueIdentifier)
      .then(value => Number(value));
  }

  private markLastMetricTimestampSentToTheServer(timestamp: number): Promise<void> {
    return this.secureKeyValueStore.save(LastMetricTimestampSentToTheServerUniqueIdentifier, `${timestamp}`);
  }

  private clearStorageFromUnnecessaryMetrics(): Promise<void> {
    return this.getLastMetricTimestampSentToTheServer().then(lastTimestamp => {
      if (lastTimestamp) {
        this.metricsStorageCleaner.deleteUntilTimestamp(lastTimestamp);
      }
    });
  }
}
