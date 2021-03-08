import {DefaultMetricsStorage} from '../MetricsStorage';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../../StorageService/tests/StorageServiceMock';

import {MetricFactory} from './MetricFactory';

describe('MetricsStorage', () => {
  let sut: DefaultMetricsStorage;

  beforeEach(() => {
    sut = new DefaultMetricsStorage(new StorageServiceMock());
  });

  it('can save an retrieve an empty array of metrics', async () => {
    await sut.save([]);
    const result = await sut.retrieve();
    expect(result).toStrictEqual([]);
  });

  it('can save an retrieve one metric with no payload', async () => {
    const metric = MetricFactory.createTestMetricWithEmptyPayload();
    await sut.save([metric]);
    const result = await sut.retrieve();
    expect(result).toStrictEqual([metric]);
  });

  it('can save an retrieve one metric with payload', async () => {
    const metric = MetricFactory.createTestMetricWithCustomPayload();
    await sut.save([metric]);
    const result = await sut.retrieve();
    expect(result).toStrictEqual([metric]);
  });

  it('can save an retrieve an array of multiple metrics', async () => {
    const metrics = MetricFactory.createTestMetrics();
    await sut.save(metrics);
    const result = await sut.retrieve();
    expect(result).toStrictEqual(metrics);
  });

  it('can delete metrics with timestamp below or equal to timestamp', async () => {
    const metric1 = MetricFactory.createTestMetricWithEmptyPayload(1611324024314);
    const metric2 = MetricFactory.createTestMetricWithCustomPayload(1611324024315);
    const metric3 = MetricFactory.createTestMetricWithCustomPayload(1611324024316);
    await sut.save([metric1, metric2, metric3]);

    await sut.deleteUntilTimestamp(1611324024313);
    const result1 = await sut.retrieve();
    expect(result1).toStrictEqual([metric1, metric2, metric3]);

    await sut.deleteUntilTimestamp(1611324024315);
    const result2 = await sut.retrieve();
    expect(result2).toStrictEqual([metric3]);

    await sut.deleteUntilTimestamp(1611324024317);
    const result3 = await sut.retrieve();
    expect(result3).toStrictEqual([]);
  });
});
