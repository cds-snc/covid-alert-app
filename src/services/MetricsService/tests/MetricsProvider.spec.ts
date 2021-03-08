import {DefaultMetricsProvider} from '../MetricsProvider';
import {MetricsPublisher, DefaultMetricsPublisher} from '../MetricsPublisher';
import {DefaultMetricsStorage} from '../MetricsStorage';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../../StorageService/tests/StorageServiceMock';

import {MetricFactory} from './MetricFactory';

describe('MetricsProvider', () => {
  let metricsPublisher: MetricsPublisher;
  let sut: DefaultMetricsProvider;

  beforeEach(() => {
    const metricsStorage = new DefaultMetricsStorage(new StorageServiceMock());
    metricsPublisher = new DefaultMetricsPublisher(metricsStorage);
    sut = new DefaultMetricsProvider(metricsStorage);
  });

  it('can retrieve all metrics when none have been published', async () => {
    const result = await sut.retrieveAll();
    expect(result).toStrictEqual([]);
  });

  it('can retrieve all metrics when some have been published', async () => {
    const metrics = MetricFactory.createTestMetrics();
    await metricsPublisher.publish(metrics);
    const result = await sut.retrieveAll();
    expect(result).toStrictEqual(metrics);
  });

  it('can retrieve metrics above timestamp', async () => {
    const metric1 = MetricFactory.createTestMetricWithEmptyPayload(1611324024314);
    const metric2 = MetricFactory.createTestMetricWithCustomPayload(1611324024315);
    const metric3 = MetricFactory.createTestMetricWithCustomPayload(1611324024316);
    await metricsPublisher.publish([metric1, metric2, metric3]);

    const result1 = await sut.retrieveLaterThanTimestamp(1611324024313);
    expect(result1).toStrictEqual([metric1, metric2, metric3]);

    const result2 = await sut.retrieveLaterThanTimestamp(1611324024315);
    expect(result2).toStrictEqual([metric3]);

    const result3 = await sut.retrieveLaterThanTimestamp(1611324024316);
    expect(result3).toStrictEqual([]);
  });
});
