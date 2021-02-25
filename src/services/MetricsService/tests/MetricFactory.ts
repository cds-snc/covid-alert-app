/* eslint-disable @typescript-eslint/no-extraneous-class */
import {Metric} from '../Metric';

export class MetricFactory {
  static createTestMetricWithEmptyPayload(timestamp = 1611324024314): Metric {
    return new Metric(timestamp, 'MyCustomMetric', 'MyCustomRegion', []);
  }

  static createTestMetricWithCustomPayload(timestamp = 1611324024314): Metric {
    return new Metric(timestamp, 'MyCustomMetric', 'MyCustomRegion', [['MyPayloadKey', 'MyPayloadValue']]);
  }

  static createTestMetrics(): Metric[] {
    return [
      this.createTestMetricWithEmptyPayload(1611324024314),
      this.createTestMetricWithCustomPayload(1611324024315),
      this.createTestMetricWithEmptyPayload(1611324024316),
    ];
  }
}
