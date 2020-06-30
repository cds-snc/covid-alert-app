/* eslint-disable require-atomic-updates */
import {when} from 'jest-when';

import {ExposureNotificationService, EXPOSURE_STATUS} from './ExposureNotificationService';

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(),
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
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValueOnce(undefined),
};
const bridge: any = {
  detectExposure: jest.fn().mockResolvedValue({matchedKeyCount: 0}),
  start: jest.fn().mockResolvedValue(undefined),
  getTemporaryExposureKeyHistory: jest.fn().mockResolvedValue({}),
  getStatus: jest.fn().mockResolvedValue('active'),
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
  const dateSpy = jest.spyOn(global, 'Date');
  beforeEach(() => {
    service = new ExposureNotificationService(server, i18n, storage, secureStorage, bridge);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dateSpy.mockReset();
  });

  it('backfills keys when last timestamp not available', async () => {
    dateSpy
      .mockImplementationOnce(() => new OriginalDate('2020-05-19T07:10:00+0000'))
      .mockImplementation((args: any) => new OriginalDate(args));

    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(14);
  });

  it('backfills the right amount of keys for current day', async () => {
    dateSpy.mockImplementation((args: any) => {
      if (args === undefined) return new OriginalDate('2020-05-19T11:10:00+0000');
      return new OriginalDate(args);
    });

    service.exposureStatus.append({
      lastChecked: new OriginalDate('2020-05-19T06:10:00+0000').getTime(),
    });
    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(0);

    server.retrieveDiagnosisKeys.mockClear();

    service.exposureStatus.append({
      lastChecked: new OriginalDate('2020-05-18T05:10:00+0000').getTime(),
    });
    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(1);

    server.retrieveDiagnosisKeys.mockClear();

    service.exposureStatus.append({
      lastChecked: new OriginalDate('2020-05-17T23:10:00+0000').getTime(),
    });
    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(2);
  });

  it('serializes status update', async () => {
    const updatePromise = service.updateExposureStatus();
    const anotherUpdatePromise = service.updateExposureStatus();
    await Promise.all([updatePromise, anotherUpdatePromise]);
    expect(server.getExposureConfiguration).toHaveBeenCalledTimes(1);
  });

  it('stores last update timestamp', async () => {
    const currentDatetime = new OriginalDate('2020-05-19T07:10:00+0000');
    dateSpy.mockImplementation((args: any) => {
      if (args === undefined) return currentDatetime;
      return new OriginalDate(args);
    });

    service.exposureStatus.append({
      lastChecked: new OriginalDate('2020-05-18T04:10:00+0000').getTime(),
    });

    await service.updateExposureStatus();
    expect(storage.setItem).toHaveBeenCalledWith(
      EXPOSURE_STATUS,
      expect.jsonStringContaining({
        lastChecked: currentDatetime.getTime(),
      }),
    );
  });

  it('enters Diagnosed flow when start keys submission process', async () => {
    dateSpy.mockImplementation(() => {
      return new OriginalDate();
    });
    when(server.claimOneTimeCode)
      .calledWith('12345678')
      .mockResolvedValue({
        serverPublicKey: 'serverPublicKey',
        clientPrivateKey: 'clientPrivateKey',
        clientPublicKey: 'clientPublicKey',
      });

    await service.startKeysSubmission('12345678');
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({
        type: 'diagnosed',
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
          type: 'diagnosed',
          cycleStartsAt: new OriginalDate('2020-05-18T04:10:00+0000').toString(),
        }),
      );
    dateSpy.mockImplementation((...args) =>
      args.length > 0 ? new OriginalDate(...args) : new OriginalDate('2020-05-19T04:10:00+0000'),
    );

    await service.start();

    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({
        type: 'diagnosed',
      }),
    );
  });

  describe('NeedsSubmission status calculated initially', () => {
    beforeEach(() => {
      dateSpy.mockImplementation((...args) =>
        args.length > 0 ? new OriginalDate(...args) : new OriginalDate('2020-05-19T04:10:00+0000'),
      );
      service.exposureStatus.append({
        type: 'diagnosed',
        cycleStartsAt: new OriginalDate('2020-05-14T04:10:00+0000').getTime(),
      });
    });

    it('for positive', async () => {
      service.exposureStatus.append({
        submissionLastCompletedAt: new OriginalDate('2020-05-18T04:10:00+0000').getTime(),
      });

      await service.start();
      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          needsSubmission: true,
        }),
      );
    });

    it('for negative', async () => {
      service.exposureStatus.append({
        submissionLastCompletedAt: new OriginalDate('2020-05-19T04:10:00+0000').getTime(),
      });

      await service.start();
      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          needsSubmission: false,
        }),
      );
    });
  });

  it('needsSubmission status recalculates daily', async () => {
    let currentDateString = '2020-05-19T04:10:00+0000';

    service.exposureStatus.append({
      type: 'diagnosed',
      needsSubmission: false,
      cycleStartsAt: new OriginalDate('2020-05-14T04:10:00+0000').getTime(),
      submissionLastCompletedAt: null,
    });

    dateSpy.mockImplementation((...args) =>
      args.length > 0 ? new OriginalDate(...args) : new OriginalDate(currentDateString),
    );

    await service.start();
    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: true}),
    );

    currentDateString = '2020-05-20T04:10:00+0000';
    when(secureStorage.getItem)
      .calledWith('submissionAuthKeys')
      .mockResolvedValueOnce('{}');
    await service.fetchAndSubmitKeys();

    expect(storage.setItem).toHaveBeenCalledWith(
      EXPOSURE_STATUS,
      expect.jsonStringContaining({
        submissionLastCompletedAt: new OriginalDate(currentDateString).getTime(),
      }),
    );

    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: false}),
    );

    service.exposureStatus.append({
      submissionLastCompletedAt: new OriginalDate(currentDateString).getTime(),
    });

    // advance day forward
    currentDateString = '2020-05-21T04:10:00+0000';

    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: true}),
    );

    // advance 14 days
    currentDateString = '2020-05-30T04:10:00+0000';
    service.exposureStatus.append({
      submissionLastCompletedAt: new OriginalDate('2020-05-28T04:10:00+0000').getTime(),
    });

    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: false}),
    );
  });
});
