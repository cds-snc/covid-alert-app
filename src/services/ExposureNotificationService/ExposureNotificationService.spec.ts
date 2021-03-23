/* eslint-disable require-atomic-updates */
import {when, resetAllWhenMocks} from 'jest-when';
import {Platform} from 'react-native';

import {periodSinceEpoch} from '../../shared/date-fns';
import {ExposureSummary} from '../../bridge/ExposureNotification';
import PushNotification from '../../bridge/PushNotification';
import {Key} from '../StorageService';
import {PERIODIC_TASK_INTERVAL_IN_MINUTES} from '../BackgroundSchedulerService';
// eslint-disable-next-line @shopify/strict-component-boundaries
import {FilteredMetricsService} from '../MetricsService/FilteredMetricsService';
import {EventTypeMetric} from '../MetricsService';

import {
  ExposureNotificationService,
  ExposureStatus,
  ExposureStatusType,
  EXPOSURE_STATUS,
  HOURS_PER_PERIOD,
  SystemStatus,
} from './ExposureNotificationService';

jest.mock('react-native-permissions', () => {
  return {checkNotifications: jest.fn().mockReturnValue(Promise.reject()), requestNotifications: jest.fn()};
});

const ONE_DAY = 3600 * 24 * 1000;

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(),
}));

jest.mock('../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
  downloadDiagnosisKeysFile: jest.fn(x => ''),
}));

jest.mock('react-native-background-fetch', () => {
  return {
    configure: jest.fn(),
    scheduleTask: jest.fn(),
  };
});

jest.mock('../../bridge/PushNotification', () => ({
  ...jest.requireActual('bridge/PushNotification'),
  presentLocalNotification: jest.fn(),
}));

jest.mock('react-native-system-setting', () => {
  return {
    addBluetoothListener: jest.fn(),
    addLocationListener: jest.fn(),
  };
});

jest.mock('../../bridge/ExposureCheckScheduler', () => ({
  scheduleExposureCheck: jest.fn(),
  executeExposureCheck: jest.fn(),
}));

const server: any = {
  retrieveDiagnosisKeys: jest.fn().mockResolvedValue(null),
  getExposureConfiguration: jest.fn().mockResolvedValue({}),
  claimOneTimeCode: jest.fn(),
  reportDiagnosisKeys: jest.fn(),
};
const i18n: any = {
  translate: jest.fn().mockReturnValue('foo'),
};
const storage: any = {
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValueOnce(undefined),
};
const secureStorage: any = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValueOnce(undefined),
};
const bridge: any = {
  detectExposure: jest.fn().mockResolvedValue({matchedKeyCount: 0}),
  activate: jest.fn().mockResolvedValue(undefined),
  start: jest.fn().mockResolvedValue(undefined),
  getTemporaryExposureKeyHistory: jest.fn().mockResolvedValue({}),
  getStatus: jest.fn().mockResolvedValue('active'),
  getPendingExposureSummary: jest.fn().mockResolvedValue(undefined),
};

const filteredMetricsService: FilteredMetricsService = {
  addEvent: jest.fn().mockReturnValue(Promise.resolve()),
  sendDailyMetrics: jest.fn().mockReturnValue(Promise.resolve()),
};

const getSummary = ({
  today,
  hasMatchedKey,
  daysSinceLastExposure = 5,
  attenuationDurations = [0, 0, 0],
  os = 'ios',
}: {
  today: Date;
  hasMatchedKey: boolean;
  daysSinceLastExposure: number;
  attenuationDurations: number[];
  os?: string;
}) => {
  if (!hasMatchedKey) {
    return {
      daysSinceLastExposure: 1234567,
      lastExposureTimestamp: 0,
      matchedKeyCount: 0,
      maximumRiskScore: 0,
      attenuationDurations: [0, 0, 0],
    };
  }
  const lastExposureTimestamp = today.getTime() - daysSinceLastExposure * ONE_DAY;
  const multiplier = os === 'ios' ? 60 : 1;
  return {
    daysSinceLastExposure,
    lastExposureTimestamp,
    matchedKeyCount: 1,
    maximumRiskScore: 1,
    attenuationDurations: [
      multiplier * attenuationDurations[0],
      multiplier * attenuationDurations[1],
      multiplier * attenuationDurations[2],
    ],
  };
};

/**
 * Utils for comparing jsonString
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Expect {
      jsonStringContaining<E = {}>(obj: E): any;
    }
  }
}
expect.extend({
  jsonStringContaining(jsonString, partial) {
    const json = JSON.parse(jsonString);
    const pass =
      Object.keys(partial).filter(key => JSON.stringify(partial[key]) !== JSON.stringify(json[key])).length === 0;
    if (!pass) {
      return {
        pass,
        message: () => `expect ${jsonString} to contain ${partial}`,
      };
    }
    return {
      message: () => '',
      pass,
    };
  },
});

describe('ExposureNotificationService', () => {
  let service: ExposureNotificationService;

  const OriginalDate = global.Date;
  const realDateNow = Date.now.bind(global.Date);
  const realDateUTC = Date.UTC.bind(global.Date);
  const dateSpy = jest.spyOn(global, 'Date');
  const today = new OriginalDate('2020-05-18T04:10:00+0000');
  global.Date.now = realDateNow;
  global.Date.UTC = realDateUTC;

  const testUpdateExposure = async (currentStatus: ExposureStatus, summaries: ExposureSummary[]) => {
    service.exposureStatus.append(currentStatus);
    bridge.detectExposure.mockResolvedValueOnce(summaries);
    await service.updateExposureStatus();
    return service.exposureStatus.get();
  };

  beforeEach(() => {
    service = new ExposureNotificationService(server, i18n, storage, secureStorage, bridge, filteredMetricsService);
    Platform.OS = 'ios';
    service.systemStatus.set(SystemStatus.Active);
    when(storage.getItem).calledWith(Key.OnboardedDatetime).mockResolvedValue(today.getTime());

    dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
    dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetAllWhenMocks();
    dateSpy.mockReset();
  });

  it.each(['ios', 'android'])('filters most recent over minutes threshold on %p', async os => {
    Platform.OS = os;
    const today = new OriginalDate('2020-09-22T00:00:00.000Z');
    const notExposedSummary = getSummary({
      today,
      hasMatchedKey: true,
      daysSinceLastExposure: 2,
      attenuationDurations: [5, 3, 0],
      os,
    });
    const exposedSummary1 = getSummary({
      today,
      hasMatchedKey: true,
      daysSinceLastExposure: 7,
      attenuationDurations: [17, 0, 0],
      os,
    });
    const exposedSummary2 = getSummary({
      today,
      hasMatchedKey: true,
      daysSinceLastExposure: 5,
      attenuationDurations: [0, 20, 0],
      os,
    });
    const summaries = [notExposedSummary, exposedSummary1, exposedSummary2];

    const result = service.findSummariesContainingExposures(15, summaries);
    expect(result).toHaveLength(2);
    expect(result[0]).toStrictEqual(exposedSummary2);
  });

  it.each([
    [[20, 0, 0], 'ios', ExposureStatusType.Exposed],
    [[30, 0, 0], 'ios', ExposureStatusType.Exposed],
    [[10, 0, 0], 'ios', ExposureStatusType.Monitoring],
    [[0, 10, 0], 'ios', ExposureStatusType.Monitoring],
    [[0, 10, 30], 'ios', ExposureStatusType.Monitoring],
    [[20, 0, 0], 'android', ExposureStatusType.Exposed],
    [[30, 0, 0], 'android', ExposureStatusType.Exposed],
    [[10, 0, 0], 'android', ExposureStatusType.Monitoring],
    [[0, 10, 0], 'android', ExposureStatusType.Monitoring],
    [[0, 10, 30], 'android', ExposureStatusType.Monitoring],
  ])(
    'given attenuationDurations = %p, os = %p, returns status %p',
    async (argAttenuationDurations, os, expectedStatus) => {
      Platform.OS = os;
      const today = new OriginalDate('2020-05-18T04:10:00+0000');

      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Monitoring,
      };

      const exposedSummary = getSummary({
        today,
        hasMatchedKey: true,
        daysSinceLastExposure: 7,
        attenuationDurations: argAttenuationDurations,
        os,
      });

      const newStatus = await testUpdateExposure(currentStatus, [exposedSummary]);

      expect(newStatus).toStrictEqual(expect.objectContaining({type: expectedStatus}));
    },
  );

  it.each([
    [1, 10, 'ios', ExposureStatusType.Exposed],
    [10, 10, 'ios', ExposureStatusType.Exposed],
    [20, 10, 'ios', ExposureStatusType.Exposed],
    [1, 20, 'ios', ExposureStatusType.Exposed],
    [10, 20, 'ios', ExposureStatusType.Exposed],
    [20, 20, 'ios', ExposureStatusType.Exposed],
    [1, 10, 'android', ExposureStatusType.Exposed],
    [10, 10, 'android', ExposureStatusType.Exposed],
    [20, 10, 'android', ExposureStatusType.Exposed],
    [1, 20, 'android', ExposureStatusType.Exposed],
    [10, 20, 'android', ExposureStatusType.Exposed],
    [20, 20, 'android', ExposureStatusType.Exposed],
  ])(
    'given daysSinceLastExposure = %p, immediateMinutes = %p, os = %p, returns status %p',
    async (argDaysSinceLastExposure, immediateMinutes, os, expectedStatus) => {
      // houdini test: if a user was exposed 7 days ago
      // and then they get a new summary with a matched key
      // but not enough time to trigger an exposure,
      // they stay exposed, no matter if the new match is
      // before or after the old match
      Platform.OS = os;
      const today = new OriginalDate('2020-05-18T04:10:00+0000');

      const currentSummary = getSummary({
        today,
        hasMatchedKey: true,
        daysSinceLastExposure: 7,
        attenuationDurations: [20, 0, 0],
        os,
      });

      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Exposed,
        summary: currentSummary,
      };

      const nextSummary = getSummary({
        today,
        hasMatchedKey: true,
        daysSinceLastExposure: argDaysSinceLastExposure,
        attenuationDurations: [immediateMinutes, 0, 0],
        os,
      });

      const newStatus = await testUpdateExposure(currentStatus, [nextSummary]);

      expect(newStatus).toStrictEqual(expect.objectContaining({type: expectedStatus}));
    },
  );

  it('filters out summaries with 0 matched keys', async () => {
    const today = new OriginalDate('2020-05-18T04:10:00+0000');

    const summaryConfig = {
      today,
      daysSinceLastExposure: 7,
      attenuationDurations: [20, 0, 0],
      os: 'ios',
    };

    const hasMatch = await service.findSummariesContainingExposures(15, [
      getSummary({
        hasMatchedKey: true,
        ...summaryConfig,
      }),
    ]);

    expect(hasMatch).toHaveLength(1);

    const noMatch = await service.findSummariesContainingExposures(15, [
      getSummary({
        hasMatchedKey: false,
        ...summaryConfig,
      }),
    ]);

    expect(noMatch).toHaveLength(0);
  });

  it('backfills keys when last timestamp not available', async () => {
    const today = new OriginalDate('2020-05-18T04:10:00+0000');
    dateSpy.mockImplementation((args: any) => {
      if (args === undefined) return new OriginalDate('2020-05-19T11:10:00+0000');
      return new OriginalDate(args);
    });

    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(2);
  });

  it('ignores exposed summaries if they are not more recent than ignored summary', async () => {
    const summary1 = getSummary({
      hasMatchedKey: true,
      today,
      daysSinceLastExposure: 7,
      attenuationDurations: [20, 0, 0],
      os: 'ios',
    });

    const summary2 = getSummary({
      hasMatchedKey: true,
      today,
      daysSinceLastExposure: 7,
      attenuationDurations: [20, 0, 0],
      os: 'ios',
    });

    const summary3 = getSummary({
      hasMatchedKey: true,
      today,
      daysSinceLastExposure: 8,
      attenuationDurations: [22, 0, 0],
      os: 'ios',
    });

    const summary4 = getSummary({
      hasMatchedKey: true,
      today,
      daysSinceLastExposure: 6,
      attenuationDurations: [22, 0, 0],
      os: 'ios',
    });

    const ignoredSummaries = [summary1];

    service.exposureStatus.append({ignoredSummaries});

    expect(service.isIgnoredSummary(summary2)).toStrictEqual(true);
    expect(service.isIgnoredSummary(summary3)).toStrictEqual(true);
    expect(service.isIgnoredSummary(summary4)).toStrictEqual(false);
  });

  it('backfills the right amount of keys for current day', async () => {
    dateSpy.mockImplementation((args: any) => {
      if (args === undefined) return new OriginalDate('2020-05-19T11:10:00+0000');
      return new OriginalDate(args);
    });

    service.exposureStatus.append({
      lastChecked: {
        timestamp: new OriginalDate('2020-05-19T06:10:00+0000').getTime(),
        period: periodSinceEpoch(new OriginalDate('2020-05-19T06:10:00+0000'), HOURS_PER_PERIOD),
      },
    });

    await service.updateExposureStatus();

    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(1);

    server.retrieveDiagnosisKeys.mockClear();

    service.exposureStatus.append({
      lastChecked: {
        timestamp: new OriginalDate('2020-05-18T05:10:00+0000').getTime(),
        period: periodSinceEpoch(new OriginalDate('2020-05-18T05:10:00+0000'), HOURS_PER_PERIOD),
      },
    });
    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(2);

    server.retrieveDiagnosisKeys.mockClear();

    service.exposureStatus.append({
      lastChecked: {
        timestamp: new OriginalDate('2020-05-17T23:10:00+0000').getTime(),
        period: periodSinceEpoch(new OriginalDate('2020-05-17T23:10:00+0000'), HOURS_PER_PERIOD),
      },
    });
    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(3);
  });

  it('serializes status update', async () => {
    const updatePromise = service.updateExposureStatus();
    const anotherUpdatePromise = service.updateExposureStatus();
    await Promise.all([updatePromise, anotherUpdatePromise]);
    expect(server.getExposureConfiguration).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('stores last update timestamp', async () => {
    const currentDatetime = new OriginalDate('2020-05-19T07:10:00+0000');
    dateSpy.mockImplementation((args: any) => {
      if (args === undefined) return currentDatetime;
      return new OriginalDate(args);
    });
    service.exposureStatus.append({
      lastChecked: {
        timestamp: new OriginalDate('2020-05-18T04:10:00+0000').getTime(),
        period: periodSinceEpoch(new OriginalDate('2020-05-18T04:10:00+0000'), HOURS_PER_PERIOD),
      },
    });

    const currentPeriod = periodSinceEpoch(currentDatetime, HOURS_PER_PERIOD);
    when(server.retrieveDiagnosisKeys).calledWith(currentPeriod).mockRejectedValue(null);

    await service.updateExposureStatus();

    expect(storage.setItem).toHaveBeenCalledWith(
      EXPOSURE_STATUS,
      expect.jsonStringContaining({
        lastChecked: {
          timestamp: currentDatetime.getTime(),
          period: currentPeriod - 1,
        },
      }),
    );
  });

  it('enters Diagnosed flow when start keys submission process', async () => {
    when(server.claimOneTimeCode).calledWith('12345678').mockResolvedValue({
      serverPublicKey: 'serverPublicKey',
      clientPrivateKey: 'clientPrivateKey',
      clientPublicKey: 'clientPublicKey',
    });

    await service.startKeysSubmission('12345678');
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({
        type: ExposureStatusType.Diagnosed,
        cycleEndsAt: expect.any(Number),
        needsSubmission: true,
      }),
    );
  });

  it('restores "diagnosed" status from storage', async () => {
    when(storage.getItem)
      .calledWith(EXPOSURE_STATUS)
      .mockResolvedValueOnce(
        JSON.stringify({
          type: ExposureStatusType.Diagnosed,
          cycleStartsAt: new OriginalDate('2020-05-18T04:10:00+0000').toString(),
        }),
      );

    await service.start();

    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({
        type: ExposureStatusType.Diagnosed,
      }),
    );
  });

  it('needsSubmission status recalculates daily', async () => {
    let currentDateString = '2020-05-19T04:10:00+0000';

    service.exposureStatus.append({
      type: ExposureStatusType.Diagnosed,
      needsSubmission: false,
      cycleStartsAt: new OriginalDate('2020-05-14T04:10:00+0000').getTime(),
      cycleEndsAt: new OriginalDate('2020-05-28T04:10:00+0000').getTime(),
      submissionLastCompletedAt: null,
    });

    dateSpy.mockImplementation((...args) =>
      args.length > 0 ? new OriginalDate(...args) : new OriginalDate(currentDateString),
    );

    await service.start();
    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: ExposureStatusType.Diagnosed, needsSubmission: true}),
    );

    currentDateString = '2020-05-20T04:10:00+0000';
    when(secureStorage.get).calledWith('submissionAuthKeys').mockResolvedValueOnce('{}');
    await service.fetchAndSubmitKeys({dateType: 'noDate', date: null});

    expect(storage.setItem).toHaveBeenCalledWith(
      EXPOSURE_STATUS,
      expect.jsonStringContaining({
        submissionLastCompletedAt: new OriginalDate(currentDateString).getTime(),
      }),
    );

    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: ExposureStatusType.Diagnosed, needsSubmission: false}),
    );

    service.exposureStatus.append({
      submissionLastCompletedAt: new OriginalDate(currentDateString).getTime(),
    });

    // advance day forward
    currentDateString = '2020-05-21T04:10:00+0000';

    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: ExposureStatusType.Diagnosed, needsSubmission: true}),
    );

    // advance 14 days
    currentDateString = '2020-05-30T04:10:00+0000';
    service.exposureStatus.append({
      submissionLastCompletedAt: new OriginalDate('2020-05-28T04:10:00+0000').getTime(),
    });

    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(expect.objectContaining({type: ExposureStatusType.Monitoring}));
  });

  describe('isReminderNeeded', () => {
    it('returns true when missing uploadReminderLastSentAt', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');

      const status = {
        type: ExposureStatusType.Diagnosed,
        needsSubmission: true,
        // uploadReminderLastSentAt: new Date(), don't pass this
      };

      expect(service.isReminderNeeded(status)).toStrictEqual(true);
    });

    it('returns true when uploadReminderLastSentAt is a day old', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');
      const lastSent = new OriginalDate('2020-05-17T04:10:00+0000');

      const status = {
        type: ExposureStatusType.Diagnosed,
        needsSubmission: true,
        uploadReminderLastSentAt: lastSent.getTime(),
      };

      expect(service.isReminderNeeded(status)).toStrictEqual(true);
    });

    it('returns false when uploadReminderLastSentAt is < 1 day old', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');
      const lastSent = today;

      const status = {
        type: ExposureStatusType.Diagnosed,
        needsSubmission: true,
        uploadReminderLastSentAt: lastSent.getTime(),
      };

      expect(service.isReminderNeeded(status)).toStrictEqual(false);
    });
  });

  describe('updateExposureStatus', () => {
    it('keeps lastChecked when reset from diagnosed state to monitoring state', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');

      const period = periodSinceEpoch(today, HOURS_PER_PERIOD);
      service.exposureStatus.set({
        type: ExposureStatusType.Diagnosed,
        cycleStartsAt: today.getTime() - 14 * 3600 * 24 * 1000,
        cycleEndsAt: today.getTime(),
        lastChecked: {
          period,
          timestamp: today.getTime() - ONE_DAY,
        },
      });

      await service.updateExposureStatus();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          lastChecked: {
            period,
            timestamp: today.getTime(),
          },
          type: ExposureStatusType.Monitoring,
        }),
      );
    });

    it.each([
      [1, ExposureStatusType.Exposed],
      [10, ExposureStatusType.Exposed],
      [14, ExposureStatusType.Monitoring],
      [20, ExposureStatusType.Monitoring],
    ])('if exposed %p days ago, state expected to be %p', async (daysAgo, expectedStatus) => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');
      const period = periodSinceEpoch(today, HOURS_PER_PERIOD);

      service.exposureStatus.set({
        type: ExposureStatusType.Exposed,
        lastChecked: {
          period,
          timestamp: today.getTime() - ONE_DAY,
        },
        summary: getSummary({
          today,
          hasMatchedKey: true,
          daysSinceLastExposure: daysAgo,
          attenuationDurations: [20, 0, 0],
        }),
      });

      await service.updateExposureStatus();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          lastChecked: {
            period,
            timestamp: today.getTime(),
          },
          type: expectedStatus,
        }),
      );
    });

    it('does not reset to monitoring state when lastExposureTimestamp is not available', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');
      const period = periodSinceEpoch(today, HOURS_PER_PERIOD);
      service.exposureStatus.set({
        type: ExposureStatusType.Exposed,
        lastChecked: {
          period,
          timestamp: today.getTime(),
        },
        summary: {
          daysSinceLastExposure: 2,
          lastExposureTimestamp: 0,
          matchedKeyCount: 1,
          maximumRiskScore: 1,
        },
      });

      await service.updateExposureStatus();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          type: ExposureStatusType.Exposed,
          lastChecked: {
            period,
            timestamp: today.getTime(),
          },
          summary: {
            daysSinceLastExposure: 2,
            lastExposureTimestamp: 0,
            matchedKeyCount: 1,
            maximumRiskScore: 1,
          },
        }),
      );
    });

    it('selects next exposure summary if user is not already exposed', async () => {
      const period = periodSinceEpoch(today, HOURS_PER_PERIOD);
      const nextSummary = {
        daysSinceLastExposure: 7,
        lastExposureTimestamp: today.getTime() - 7 * 3600 * 24 * 1000,
        matchedKeyCount: 1,
        maximumRiskScore: 1,
        attenuationDurations: [1200, 0, 0],
      };
      bridge.detectExposure.mockResolvedValueOnce([nextSummary]);
      service.exposureStatus.set({
        type: ExposureStatusType.Monitoring,
        lastChecked: {
          period,
          timestamp: today.getTime() - PERIODIC_TASK_INTERVAL_IN_MINUTES * 60 * 1000 - 3600 * 1000,
        },
      });

      await service.updateExposureStatus();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          type: ExposureStatusType.Exposed,
          summary: nextSummary,
        }),
      );
    });

    it('selects next exposure summary if user is already exposed', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');
      const period = periodSinceEpoch(today, HOURS_PER_PERIOD);
      const currentSummary = getSummary({
        today,
        hasMatchedKey: true,
        daysSinceLastExposure: 8,
        attenuationDurations: [17, 0, 0],
      });
      const nextSummary = getSummary({
        today,
        hasMatchedKey: true,
        daysSinceLastExposure: 7,
        attenuationDurations: [17, 0, 0],
      });

      service.exposureStatus.set({
        type: ExposureStatusType.Exposed,
        lastChecked: {
          period,
          timestamp: today.getTime() - 10 * 60 * 60 * 1000,
        },
        summary: currentSummary,
      });
      bridge.detectExposure.mockResolvedValueOnce([nextSummary]);

      await service.updateExposureStatus();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          type: ExposureStatusType.Exposed,
          summary: nextSummary,
        }),
      );
    });

    it('processes the push notification when exposed', async () => {
      service.exposureStatus.set({
        type: ExposureStatusType.Exposed,
      });

      await service.updateExposureStatusInBackground();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          notificationSent: true,
        }),
      );
    });

    it("doesn't send notification if status is Monitoring", async () => {
      service.exposureStatus.set({
        type: ExposureStatusType.Monitoring,
      });

      await service.updateExposureStatusInBackground();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          type: ExposureStatusType.Monitoring,
        }),
      );
      expect(PushNotification.presentLocalNotification).not.toHaveBeenCalled();
    });

    it('stays diagnosed if within countdown period', async () => {
      const period = periodSinceEpoch(today, HOURS_PER_PERIOD);
      const nextSummary = {
        daysSinceLastExposure: 7,
        lastExposureTimestamp: today.getTime() - 7 * 3600 * 24 * 1000,
        matchedKeyCount: 4,
        maximumRiskScore: 25,
        attenuationDurations: [1200, 1200, 0],
      };
      bridge.detectExposure.mockResolvedValueOnce([nextSummary]);
      service.exposureStatus.set({
        type: ExposureStatusType.Diagnosed,
        lastChecked: {
          period,
          timestamp: today.getTime() - PERIODIC_TASK_INTERVAL_IN_MINUTES * 60 * 1000 - 3600 * 1000,
        },
      });

      await service.updateExposureStatus();

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          type: ExposureStatusType.Diagnosed,
        }),
      );
    });

    it('processes the reminder push notification when diagnosed', async () => {
      const today = new OriginalDate('2020-05-18T04:10:00+0000');
      const lastSent = new OriginalDate('2020-05-17T04:10:00+0000');
      service.exposureStatus.set({
        type: ExposureStatusType.Diagnosed,
        needsSubmission: true,
        uploadReminderLastSentAt: lastSent.getTime(),
        lastChecked: {
          period: periodSinceEpoch(today, HOURS_PER_PERIOD),
          timestamp: today.getTime() - 10 * 60 * 60 * 1000,
        },
      });

      await service.updateExposureStatusInBackground();

      expect(PushNotification.presentLocalNotification).toHaveBeenCalledTimes(1);

      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          uploadReminderLastSentAt: today.getTime(),
        }),
      );
    });
  });

  it('calculateNeedsSubmission when monitoring', () => {
    service.exposureStatus.set({
      type: ExposureStatusType.Monitoring,
    });
    expect(service.calculateNeedsSubmission()).toStrictEqual(false);
  });

  it('calculateNeedsSubmission when exposed', () => {
    const today = new OriginalDate();
    service.exposureStatus.set({
      type: ExposureStatusType.Exposed,
      summary: getSummary({
        today,
        hasMatchedKey: true,
        daysSinceLastExposure: 7,
        attenuationDurations: [20, 0, 0],
      }),
    });
    expect(service.calculateNeedsSubmission()).toStrictEqual(false);
  });

  it('calculateNeedsSubmission when diagnosed false', () => {
    const today = new OriginalDate();
    service.exposureStatus.set({
      type: ExposureStatusType.Diagnosed,
      cycleStartsAt: today.getTime() - 15 * ONE_DAY,
      cycleEndsAt: today.getTime() - ONE_DAY,
      needsSubmission: true,
    });
    dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
    expect(service.calculateNeedsSubmission()).toStrictEqual(false);
  });

  it('calculateNeedsSubmission when diagnosed true', () => {
    const today = new OriginalDate();
    service.exposureStatus.set({
      type: ExposureStatusType.Diagnosed,
      cycleStartsAt: today.getTime() - 12 * ONE_DAY,
      cycleEndsAt: today.getTime() + 3 * ONE_DAY,
      needsSubmission: false,
    });
    expect(service.calculateNeedsSubmission()).toStrictEqual(true);
  });

  it('calculateNeedsSubmission when already submitted for that day false', () => {
    const today = new OriginalDate();
    service.exposureStatus.set({
      type: ExposureStatusType.Diagnosed,
      cycleStartsAt: today.getTime() - 10 * ONE_DAY,
      cycleEndsAt: today.getTime() + 4 * ONE_DAY,
      submissionLastCompletedAt: today.getTime(),
      needsSubmission: true,
    });

    expect(service.calculateNeedsSubmission()).toStrictEqual(false);
  });

  it('updateExposure, stay Monitoring', () => {
    service.exposureStatus.set({
      type: ExposureStatusType.Monitoring,
    });
    expect(service.updateExposure()).toStrictEqual(
      expect.objectContaining({
        type: ExposureStatusType.Monitoring,
      }),
    );
  });

  describe('getPeriodsSinceLastFetch', () => {
    it('returns an array of [0, runningPeriod] if _lastCheckedPeriod is undefined', () => {
      expect(service.getPeriodsSinceLastFetch()).toStrictEqual([0, 18400]);
    });

    it('returns an array of checkdates between lastCheckedPeriod and runningPeriod', () => {
      expect(service.getPeriodsSinceLastFetch(18395)).toStrictEqual([18400, 18399, 18398, 18397, 18396, 18395]);
    });

    it('returns an array of runningPeriod when current runningPeriod == _lastCheckedPeriod', () => {
      expect(service.getPeriodsSinceLastFetch(18400)).toStrictEqual([18400]);
    });

    it('returns an array of [runningPeriod, runningPeriod - 1] when current runningPeriod = _lastCheckedPeriod + 1', () => {
      expect(service.getPeriodsSinceLastFetch(18399)).toStrictEqual([18400, 18399]);
    });
  });

  describe('shouldPerformExposureCheck', () => {
    it('returns false if not onboarded', async () => {
      when(storage.getItem).calledWith(Key.OnboardedDatetime).mockResolvedValueOnce(false);

      const shouldPerformExposureCheck = await service.shouldPerformExposureCheck();

      expect(shouldPerformExposureCheck).toStrictEqual(false);
    });

    it('returns false if last check is too recent', async () => {
      service.exposureStatus.set({
        type: ExposureStatusType.Monitoring,
        lastChecked: {
          period: periodSinceEpoch(today, HOURS_PER_PERIOD),
          timestamp: today.getTime() - 60 * 60 * 1000,
        },
      });

      const shouldPerformExposureCheck = await service.shouldPerformExposureCheck();

      expect(shouldPerformExposureCheck).toStrictEqual(false);
    });

    it('returns true if last check is outside defined range', async () => {
      service.exposureStatus.set({
        type: ExposureStatusType.Monitoring,
        lastChecked: {
          period: periodSinceEpoch(today, HOURS_PER_PERIOD),
          timestamp: today.getTime() - 10 * 60 * 60 * 1000,
        },
      });

      const shouldPerformExposureCheck = await service.shouldPerformExposureCheck();

      expect(shouldPerformExposureCheck).toStrictEqual(true);
    });
  });
  describe('performExposureStatusUpdate', () => {
    const may18 = new OriginalDate('2020-05-18T04:10:00+0000');
    const may19 = new OriginalDate('2020-05-19T04:10:00+0000');
    const may20 = new OriginalDate('2020-05-20T04:10:00+0000');
    const june18 = new OriginalDate('2020-06-18T04:10:00+0000');
    const summary1 = getSummary({
      today: may18,
      hasMatchedKey: true,
      daysSinceLastExposure: 10,
      attenuationDurations: [20, 0, 0],
    });
    const summary2 = getSummary({
      today: may18,
      hasMatchedKey: true,
      daysSinceLastExposure: 1,
      attenuationDurations: [20, 0, 0],
    });
    beforeEach(() => {
      service.exposureStatus.set({
        type: ExposureStatusType.Monitoring,
      });
    });

    it('does not update exposureDetectedAt when an old exposure is returned', async () => {
      // mock returning an exposure
      bridge.detectExposure.mockResolvedValueOnce([summary1]);

      // check that we are exposed and the detected at date is may18
      await service.performExposureStatusUpdate();
      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          exposureDetectedAt: may18.getTime(),
          type: ExposureStatusType.Exposed,
        }),
      );
      // mock changing the current date
      dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : may19));
      bridge.detectExposure.mockResolvedValueOnce([summary1]);
      // check that we are exposed and the detected at date is still the same
      await service.performExposureStatusUpdate();
      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          exposureDetectedAt: may18.getTime(),
          type: ExposureStatusType.Exposed,
        }),
      );
    });
    it('saves the exposure notification time to the history correctly - 2 exposures same day', async () => {
      bridge.detectExposure.mockResolvedValueOnce([summary1]);
      await service.performExposureStatusUpdate();
      expect(service.exposureHistory.get()).toStrictEqual([may18.getTime()]);
      bridge.detectExposure.mockResolvedValueOnce([summary2]);
      await service.performExposureStatusUpdate();
      // why a 2nd status update? I don't know
      await service.performExposureStatusUpdate();
      expect(service.exposureHistory.get()).toStrictEqual([may18.getTime(), may18.getTime()]);
    });
    it('saves the exposure notification time to the history correctly - 2 exposures different days', async () => {
      bridge.detectExposure.mockResolvedValueOnce([summary1]);
      await service.performExposureStatusUpdate();
      expect(service.exposureHistory.get()).toStrictEqual([may18.getTime()]);
      dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : may19));
      bridge.detectExposure.mockResolvedValueOnce([summary2]);
      await service.performExposureStatusUpdate();
      expect(service.exposureHistory.get()).toStrictEqual([may18.getTime(), may19.getTime()]);
    });
    it('erases exposure history when the state returns to monitoring', async () => {
      bridge.detectExposure.mockResolvedValueOnce([summary1]);
      await service.performExposureStatusUpdate();
      bridge.detectExposure.mockResolvedValueOnce([summary2]);
      await service.performExposureStatusUpdate();
      expect(service.exposureHistory.get()).toStrictEqual([may18.getTime(), may18.getTime()]);
      dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : june18));
      await service.performExposureStatusUpdate();
      expect(service.exposureHistory.get()).toStrictEqual([]);
    });
  });

  describe('selectExposureSummary', () => {
    const summary1 = getSummary({
      today,
      hasMatchedKey: true,
      daysSinceLastExposure: 1,
      attenuationDurations: [20, 0, 0],
    });
    const summary2 = getSummary({
      today,
      hasMatchedKey: true,
      daysSinceLastExposure: 2,
      attenuationDurations: [20, 0, 0],
    });
    it('selects the next Exposure Summary if state is monitoring', () => {
      service.exposureStatus.set({
        type: ExposureStatusType.Monitoring,
      });
      const {summary, isNext} = service.selectExposureSummary(summary1);
      expect(summary).toStrictEqual(summary1);
      expect(isNext).toStrictEqual(true);
    });
    it('selects the current summary if the next one is older', () => {
      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Exposed,
        summary: summary1,
        exposureDetectedAt: today.getTime(),
      };
      service.exposureStatus.set(currentStatus);
      const {summary, isNext} = service.selectExposureSummary(summary2);
      expect(summary).toStrictEqual(summary1);
      expect(isNext).toStrictEqual(false);
    });
    it('selects the next summary if the next one is newer', () => {
      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Exposed,
        summary: summary2,
        exposureDetectedAt: today.getTime(),
      };
      service.exposureStatus.set(currentStatus);
      const {summary, isNext} = service.selectExposureSummary(summary1);
      expect(summary).toStrictEqual(summary1);
      expect(isNext).toStrictEqual(true);
    });
  });
  describe('getExposureDetectedAt', () => {
    const may18 = new OriginalDate('2020-05-18T04:10:00+0000');
    const may19 = new OriginalDate('2020-05-19T04:10:00+0000');
    const may20 = new OriginalDate('2020-05-20T04:10:00+0000');
    const summary = getSummary({
      today: may18,
      hasMatchedKey: true,
      daysSinceLastExposure: 1,
      attenuationDurations: [20, 0, 0],
    });
    it('returns an empty array if status = monitoring', () => {
      const dates = service.getExposureDetectedAt();
      expect(dates).toStrictEqual([]);
    });
    it('returns exposureDetectedAt if there is no exposure history', () => {
      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Exposed,
        summary,
        exposureDetectedAt: may18.getTime(),
      };
      service.exposureStatus.set(currentStatus);
      const dates = service.getExposureDetectedAt();
      expect(dates).toStrictEqual([may18]);
    });
    it('returns the exposure history if it exists', () => {
      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Exposed,
        summary,
        exposureDetectedAt: may20.getTime(),
      };
      service.exposureStatus.set(currentStatus);
      service.exposureHistory.set([may20.getTime(), may19.getTime(), may18.getTime()]);
      const dates = service.getExposureDetectedAt();
      expect(dates).toStrictEqual([may20, may19, may18]);
    });
    it('returns and sorts the exposure history if it exists', () => {
      const currentStatus: ExposureStatus = {
        type: ExposureStatusType.Exposed,
        summary,
        exposureDetectedAt: may20.getTime(),
      };
      service.exposureStatus.set(currentStatus);
      service.exposureHistory.set([may18.getTime(), may19.getTime(), may20.getTime()]);
      const dates = service.getExposureDetectedAt();
      expect(dates).toStrictEqual([may20, may19, may18]);
    });
  });

  describe('testing metrics component', () => {
    it('updateExposureStatusInBackground publishes BackgroundProcess metric with succeeded state set to true if process has finished successfully', async () => {
      await service.updateExposureStatusInBackground();
      expect(filteredMetricsService.addEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EventTypeMetric.BackgroundProcess,
          succeeded: true,
        }),
      );
    });

    it('updateExposureStatusInBackground publishes BackgroundProcess metric with succeeded state set to false if process has failed', async () => {
      when(storage.getItem).calledWith(EXPOSURE_STATUS).mockRejectedValue(new Error('Async error'));

      await service.updateExposureStatusInBackground();

      expect(filteredMetricsService.addEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EventTypeMetric.BackgroundProcess,
          succeeded: false,
        }),
      );
    });

    it('updateExposureStatusInBackground pushes metrics to the server if process has finished successfully', async () => {
      await service.updateExposureStatusInBackground();
      expect(filteredMetricsService.sendDailyMetrics).toHaveBeenCalled();
    });

    it('updateExposureStatusInBackground pushes metrics to the server if process has failed', async () => {
      await service.updateExposureStatusInBackground();
      expect(filteredMetricsService.sendDailyMetrics).toHaveBeenCalled();
    });

    it('performExposureStatusUpdate publishes BackgroundCheck event', async () => {
      await service.performExposureStatusUpdate();
      expect(filteredMetricsService.addEvent).toHaveBeenCalledWith({type: EventTypeMetric.BackgroundCheck});
    });

    it('setExposureDetectedAt publishes Exposed event', async () => {
      await service.setExposureDetectedAt(
        {
          attenuationDurations: [],
          daysSinceLastExposure: 0,
          lastExposureTimestamp: 0,
          matchedKeyCount: 0,
          maximumRiskScore: 0,
        },
        0,
      );
      expect(filteredMetricsService.addEvent).toHaveBeenCalledWith(
        expect.objectContaining({type: EventTypeMetric.Exposed}),
      );
    });
  });
});
