import {Metric} from './Metric';
import {MetricsService} from './MetricsService';

export class InactiveMetricsService implements MetricsService {
  publishMetric(_metric: Metric, _forcePush?: boolean): Promise<void> {
    return Promise.resolve();
  }

  publishMetrics(_metrics: Metric[], _forcePush?: boolean): Promise<void> {
    return Promise.resolve();
  }

  sendDailyMetrics(): Promise<void> {
    return Promise.resolve();
  }
}
