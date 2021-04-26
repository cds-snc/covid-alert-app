import {FilteredMetricsService} from '../FilteredMetricsService';
import {MetricsService} from '../MetricsService';
import {EventTypeMetric, MetricsFilter} from '../MetricsFilter';

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(),
}));

jest.mock('react-native-permissions', () => {
  return {checkNotifications: jest.fn(), requestNotifications: jest.fn()};
});

jest.mock('react-native-background-fetch', () => {
  return {
    configure: jest.fn(),
    scheduleTask: jest.fn(),
  };
});

jest.mock('react-native-system-setting', () => {
  return {
    addBluetoothListener: jest.fn(),
    addLocationListener: jest.fn(),
  };
});

jest.mock('../../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
  downloadDiagnosisKeysFile: jest.fn(x => ''),
}));

const metricsService: MetricsService = {
  publishMetric: jest.fn(),
  publishMetrics: jest.fn(),
  sendDailyMetrics: jest.fn(),
  retrieveAllMetricsInStorage: jest.fn(),
};

const metricsFilter: MetricsFilter = {
  filterEvent: jest.fn(),
  getDelayedOnboardedEventIfPublishable: jest.fn(),
};

describe('FilteredMetricsService', () => {
  let sut: FilteredMetricsService;

  beforeEach(() => {
    sut = new FilteredMetricsService(metricsService, metricsFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('addEvent does not publish metric if filtered event is null', async () => {
    metricsFilter.filterEvent.mockReturnValue(Promise.resolve(null));

    await sut.addEvent({type: EventTypeMetric.ActiveUser});
    expect(metricsService.publishMetric).not.toHaveBeenCalled();
  });

  it('addEvent publishes metric if filtered event is not null', async () => {
    metricsFilter.filterEvent.mockReturnValue(
      Promise.resolve({eventType: EventTypeMetric.ActiveUser, payload: [], shouldBePushedToServerRightAway: true}),
    );

    await sut.addEvent({type: EventTypeMetric.ActiveUser});
    expect(metricsService.publishMetric).toHaveBeenCalled();
  });

  it('sendDailyMetrics publishes delayed metric if there is one and sends daily metrics', async () => {
    metricsFilter.getDelayedOnboardedEventIfPublishable.mockReturnValue(
      Promise.resolve({eventType: EventTypeMetric.ActiveUser, payload: [], shouldBePushedToServerRightAway: true}),
    );

    await sut.sendDailyMetrics('', '');
    expect(metricsService.publishMetric).toHaveBeenCalled();
    expect(metricsService.sendDailyMetrics).toHaveBeenCalled();
  });

  it('sendDailyMetrics does not publish delayed metric if there is none and still sends daily metrics', async () => {
    metricsFilter.getDelayedOnboardedEventIfPublishable.mockReturnValue(Promise.resolve(null));

    await sut.sendDailyMetrics('', '');
    expect(metricsService.publishMetric).not.toHaveBeenCalled();
    expect(metricsService.sendDailyMetrics).toHaveBeenCalled();
  });
});
