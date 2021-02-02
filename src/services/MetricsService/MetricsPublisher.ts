import {Metric} from './Metric';
import {MetricsStorageWriter} from './MetricsStorage';

export interface MetricsPublisher {
  publish(metrics: Metric[]): Promise<void>;
}

export class DefaultMetricsPublisher implements MetricsPublisher {
  private metricsStorage: MetricsStorageWriter;

  constructor(metricsStorage: MetricsStorageWriter) {
    this.metricsStorage = metricsStorage;
  }

  publish(metrics: Metric[]): Promise<void> {
    return this.metricsStorage.save(metrics);
  }
}
