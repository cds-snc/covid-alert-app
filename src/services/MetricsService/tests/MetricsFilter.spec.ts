import {MetricsFilter, DefaultMetricsFilter, EventTypeMetric} from '../MetricsFilter';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {ExposureStatusType} from '../../ExposureNotificationService/ExposureNotificationService';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {KeyValueStoreMock} from '../../StorageService/tests/KeyValueStoreMock';

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

describe('MetricsFilter', () => {
  let sut: MetricsFilter;

  const OriginalDate = global.Date;
  const realDateNow = Date.now.bind(global.Date);
  const realDateUTC = Date.UTC.bind(global.Date);
  let today = new OriginalDate('2019-01-01T12:00:00.000Z');
  const dateSpy = jest.spyOn(global, 'Date');
  dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
  global.Date.now = realDateNow;
  global.Date.UTC = realDateUTC;

  beforeEach(() => {
    sut = new DefaultMetricsFilter(new KeyValueStoreMock());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('installed event is only published once', async () => {
    const filteredEvent1 = await sut.filterEvent({type: EventTypeMetric.Installed});
    expect(filteredEvent1).not.toBeNull();

    const filteredEvent2 = await sut.filterEvent({type: EventTypeMetric.Installed});
    expect(filteredEvent2).toBeNull();
  });

  it('onboarded event is only published once', async () => {
    const filteredEvent1 = await sut.filterEvent({type: EventTypeMetric.Onboarded});
    expect(filteredEvent1).toBeNull();

    const filteredEvent2 = await sut.getDelayedOnboardedEventIfPublishable('n/a', 'n/a');
    expect(filteredEvent2).not.toBeNull();

    const filteredEvent3 = await sut.getDelayedOnboardedEventIfPublishable('n/a', 'n/a');
    expect(filteredEvent3).toBeNull();
  });

  it('exposed-clear event is only published if in exposed state', async () => {
    const filteredEvent1 = await sut.filterEvent({
      type: EventTypeMetric.ExposedClear,
      exposureStatus: {
        type: ExposureStatusType.Monitoring,
        lastChecked: null,
        ignoredSummaries: null,
      },
    });
    expect(filteredEvent1).toBeNull();

    const filteredEvent2 = await sut.filterEvent({
      type: EventTypeMetric.ExposedClear,
      exposureStatus: {
        type: ExposureStatusType.Exposed,
        summary: {
          attenuationDurations: [],
          daysSinceLastExposure: 1,
          lastExposureTimestamp: 1,
          matchedKeyCount: 1,
          maximumRiskScore: 1,
        },
        exposureDetectedAt: 1,
        notificationSent: null,
        lastChecked: null,
        ignoredSummaries: null,
      },
    });
    expect(filteredEvent2).not.toBeNull();
  });

  it('active-user event is only published once a day', async () => {
    today = new OriginalDate('2019-01-01T12:00:00.000Z');

    const filteredEvent1 = await sut.filterEvent({type: EventTypeMetric.ActiveUser});
    expect(filteredEvent1).not.toBeNull();

    const filteredEvent2 = await sut.filterEvent({type: EventTypeMetric.ActiveUser});
    expect(filteredEvent2).toBeNull();

    today = new OriginalDate('2019-01-02T00:00:00.000Z');

    const filteredEvent3 = await sut.filterEvent({type: EventTypeMetric.ActiveUser});
    expect(filteredEvent3).not.toBeNull();
  });

  it('background-check event is only published once a day', async () => {
    // day 1
    today = new OriginalDate('2019-01-01T12:00:00.000Z');

    const filteredEvent1 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent1).toBeNull();
    const filteredEvent2 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent2).toBeNull();
    const filteredEvent3 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent3).toBeNull();
    const filteredEvent4 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent4).toBeNull();
    const filteredEvent5 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent5).toBeNull();

    // day 2
    today = new OriginalDate('2019-01-02T05:00:00.000Z');

    const filteredEvent6 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent6).toStrictEqual({
      eventType: EventTypeMetric.BackgroundCheck,
      payload: [
        ['count', '5'],
        // we expect the `utcDay` field to be equal to the day 1 UTC midnight time
        ['utcDay', String(new OriginalDate('2019-01-01T00:00:00.000Z').getTime())],
      ],
      shouldBePushedToServerRightAway: false,
    });

    const filteredEvent7 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent7).toBeNull();
    const filteredEvent8 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent8).toBeNull();

    // day 3
    today = new OriginalDate('2019-01-03T08:00:00.000Z');

    const filteredEvent9 = await sut.filterEvent({type: EventTypeMetric.BackgroundCheck});
    expect(filteredEvent9).toStrictEqual({
      eventType: EventTypeMetric.BackgroundCheck,
      payload: [
        ['count', '3'],
        // we expect the `utcDay` field to be equal to the day 2 UTC midnight time
        ['utcDay', String(new OriginalDate('2019-01-02T00:00:00.000Z').getTime())],
      ],
      shouldBePushedToServerRightAway: false,
    });
  });
});
