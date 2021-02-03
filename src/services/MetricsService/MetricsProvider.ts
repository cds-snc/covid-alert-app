import {Metric} from './Metric';
import {MetricsStorageReader} from './MetricsStorage';

export interface MetricsProvider {
  retrieveAll(): Promise<Metric[]>;
  retrieveLaterThanTimestamp(timestamp: number): Promise<Metric[]>;
}

export class DefaultMetricsProvider implements MetricsProvider {
  private metricsStorage: MetricsStorageReader;

  constructor(metricsStorage: MetricsStorageReader) {
    this.metricsStorage = metricsStorage;
  }

  retrieveAll(): Promise<Metric[]> {
    return this.metricsStorage.retrieve();
  }

  retrieveLaterThanTimestamp(timestamp: number): Promise<Metric[]> {
    return this.retrieveAll().then(metrics => metrics.filter(metric => metric.timestamp > timestamp));
  }
}
