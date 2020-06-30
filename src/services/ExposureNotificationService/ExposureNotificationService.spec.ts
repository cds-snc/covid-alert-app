/* eslint-disable require-atomic-updates */
import {when} from 'jest-when';

import {ExposureNotificationService, LAST_CHECK_TIMESTAMP} from './ExposureNotificationService';

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

    storage.getItem.mockResolvedValue(new OriginalDate('2020-05-19T06:10:00+0000').getTime());
    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(0);

    server.retrieveDiagnosisKeys.mockClear();

    storage.getItem.mockResolvedValue(new OriginalDate('2020-05-18T05:10:00+0000').getTime());

    await service.updateExposureStatus();
    expect(server.retrieveDiagnosisKeys).toHaveBeenCalledTimes(1);

    server.retrieveDiagnosisKeys.mockClear();
    storage.getItem.mockResolvedValue(new OriginalDate('2020-05-17T23:10:00+0000').getTime());

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

    when(storage.getItem)
      .calledWith(LAST_CHECK_TIMESTAMP)
      .mockResolvedValue(new OriginalDate('2020-05-18T04:10:00+0000').getTime());

    await service.updateExposureStatus();
    expect(storage.setItem).toHaveBeenCalledWith(LAST_CHECK_TIMESTAMP, `${currentDatetime.getTime()}`);
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
        cycleEndsAt: expect.any(OriginalDate),
        needsSubmission: true,
      }),
    );
  });

  it('restores "diagnosed" status from storage', async () => {
    when(storage.getItem)
      .calledWith('submissionCycleStartedAt')
      .mockResolvedValueOnce(new OriginalDate('2020-05-18T04:10:00+0000').toString());
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
      when(storage.getItem)
        .calledWith('submissionCycleStartedAt')
        .mockResolvedValue(new OriginalDate('2020-05-14T04:10:00+0000').toString());
    });

    it('for positive', async () => {
      when(storage.getItem)
        .calledWith('submissionLastCompletedAt')
        .mockResolvedValue(new OriginalDate('2020-05-18T04:10:00+0000').toString());

      await service.start();
      expect(service.exposureStatus.get()).toStrictEqual(
        expect.objectContaining({
          needsSubmission: false,
        }),
      );
    });
    it('for negative', async () => {
      when(storage.getItem)
        .calledWith('submissionLastCompletedAt')
        .mockResolvedValue(new OriginalDate('2020-05-19T04:10:00+0000').getTime().toString());
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

    when(storage.getItem)
      .calledWith('submissionCycleStartedAt')
      .mockResolvedValue(new OriginalDate('2020-05-14T04:10:00+0000').getTime().toString());
    when(storage.getItem)
      .calledWith('submissionLastCompletedAt')
      .mockResolvedValue(null);

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
      'submissionLastCompletedAt',
      new OriginalDate(currentDateString).getTime().toString(),
    );

    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: false}),
    );

    when(storage.getItem)
      .calledWith('submissionLastCompletedAt')
      .mockResolvedValue(new OriginalDate(currentDateString).getTime().toString());

    // advance day forward
    currentDateString = '2020-05-21T04:10:00+0000';

    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: true}),
    );

    // advance 14 days
    currentDateString = '2020-05-30T04:10:00+0000';
    when(storage.getItem)
      .calledWith('submissionLastCompletedAt')
      .mockResolvedValue(new OriginalDate('2020-05-28T04:10:00+0000').getTime().toString());

    await service.updateExposureStatus();
    expect(service.exposureStatus.get()).toStrictEqual(
      expect.objectContaining({type: 'diagnosed', needsSubmission: false}),
    );
  });
});
