import {DefaultMetricsService, MetricsService} from '../MetricsService';
import {MetricsPublisher, DefaultMetricsPublisher} from '../MetricsPublisher';
import {DefaultMetricsStorage} from '../MetricsStorage';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {SecureKeyValueStore} from '../../StorageService/KeyValueStore';
import {DefaultMetricsProvider, MetricsProvider} from '../MetricsProvider';
import {DefaultMetricsJsonSerializer, MetricsJsonSerializer} from '../MetricsJsonSerializer';
import {MetricsPusher, MetricsPusherResult} from '../MetricsPusher';
import {Metric} from '../Metric';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {KeyValueStoreMock} from '../../StorageService/tests/KeyValueStoreMock';

import {MetricFactory} from './MetricFactory';

const metricsPusherMock: MetricsPusher = {
  push: jest.fn().mockReturnValue(Promise.resolve(MetricsPusherResult.Success)),
};

describe('MetricsService', () => {
  let sut: MetricsService;

  let metricsStorage: DefaultMetricsStorage;
  let metricsProvider: MetricsProvider;

  beforeEach(() => {
    const secureKeyValueStore: SecureKeyValueStore = new KeyValueStoreMock();
    metricsStorage = new DefaultMetricsStorage(secureKeyValueStore);
    const metricsPublisher: MetricsPublisher = new DefaultMetricsPublisher(metricsStorage);
    metricsProvider = new DefaultMetricsProvider(metricsStorage);
    const metricsJsonSerializer: MetricsJsonSerializer = new DefaultMetricsJsonSerializer(
      '1.0.0',
      'ios',
      '12.5',
      'samsung',
      'Pixel 3',
      '11',
    );
    sut = new DefaultMetricsService(
      secureKeyValueStore,
      metricsPublisher,
      metricsProvider,
      metricsStorage,
      metricsJsonSerializer,
      metricsPusherMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('both metrics provider and metrics storage are in sync when returning all metrics', async () => {
    const metrics = MetricFactory.createTestMetrics();
    await sut.publishMetrics(metrics);

    const metricsFromProvider = await metricsProvider.retrieveAll();
    const metricsFromStorage = await metricsStorage.retrieve();

    expect(metricsFromProvider).toStrictEqual(metrics);
    expect(metricsFromStorage).toStrictEqual(metrics);
  });

  it('metrics provider returns metrics in the right order when requesting metrics after specific timestamp', async () => {
    const metrics: Metric[] = [
      MetricFactory.createTestMetricWithCustomPayload(1611324024314),
      MetricFactory.createTestMetricWithCustomPayload(1611324024315),
      MetricFactory.createTestMetricWithCustomPayload(1611324024316),
      MetricFactory.createTestMetricWithCustomPayload(1611324024317),
      MetricFactory.createTestMetricWithCustomPayload(1611324024318),
    ];
    await sut.publishMetrics(metrics);

    const metricsFromProvider = await metricsProvider.retrieveLaterThanTimestamp(1611324024316);

    expect(metricsFromProvider).toStrictEqual(metrics.slice(3));
  });

  it('metrics storage is getting cleared only if push to server was successful', async () => {
    const metrics = MetricFactory.createTestMetrics();
    await sut.publishMetrics(metrics);

    const metricsBeforeTryingToPushToServer = await metricsStorage.retrieve();
    expect(metricsBeforeTryingToPushToServer).toStrictEqual(metrics);

    metricsPusherMock.push.mockReturnValue(Promise.resolve(MetricsPusherResult.Error));
    await sut.sendDailyMetrics();

    const metricsAfterTryingToPushToServerWithoutSuccess = await metricsStorage.retrieve();
    expect(metricsAfterTryingToPushToServerWithoutSuccess).toStrictEqual(metrics);

    metricsPusherMock.push.mockReturnValue(Promise.resolve(MetricsPusherResult.Success));
    await sut.sendDailyMetrics();

    const metricsAfterTryingToPushToServerWithSuccess = await metricsStorage.retrieve();
    expect(metricsAfterTryingToPushToServerWithSuccess).toStrictEqual([]);
  });

  it('publish metrics triggers push to server if forcePush is true', async () => {
    await sut.publishMetric(MetricFactory.createTestMetricWithCustomPayload());
    expect(metricsPusherMock.push).not.toHaveBeenCalled();

    await sut.publishMetric(MetricFactory.createTestMetricWithCustomPayload(), true);
    expect(metricsPusherMock.push).toHaveBeenCalledTimes(1);
  });

  it('send daily metrics only pushes metrics if we have at least one available in the queue', async () => {
    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).not.toHaveBeenCalled();

    await sut.publishMetric(MetricFactory.createTestMetricWithCustomPayload());

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).toHaveBeenCalledTimes(1);

    metricsPusherMock.push.mockClear();

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).not.toHaveBeenCalled();
  });

  it('send daily metrics only pushes metrics to server when the day has changed', async () => {
    const OriginalDate = global.Date;
    const realDateNow = Date.now.bind(global.Date);
    const realDateUTC = Date.UTC.bind(global.Date);
    let today = new OriginalDate('2019-01-01T12:00:00.000Z');
    const dateSpy = jest.spyOn(global, 'Date');
    dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
    global.Date.now = realDateNow;
    global.Date.UTC = realDateUTC;

    await sut.publishMetric(MetricFactory.createTestMetricWithCustomPayload(1611324024315));

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).toHaveBeenCalledTimes(1);

    await sut.publishMetric(MetricFactory.createTestMetricWithCustomPayload(1611324024316));
    metricsPusherMock.push.mockClear();

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).not.toHaveBeenCalled();

    today = new OriginalDate('2019-01-01T20:00:00.000Z');

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).not.toHaveBeenCalled();

    today = new OriginalDate('2019-01-01T23:59:59.999Z');

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).not.toHaveBeenCalled();

    today = new OriginalDate('2019-01-02T00:00:00.000Z');

    await sut.sendDailyMetrics();
    expect(metricsPusherMock.push).toHaveBeenCalledTimes(1);
  });
});
