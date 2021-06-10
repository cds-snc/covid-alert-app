import MockDate from 'mockdate';

// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../StorageService/tests/StorageServiceMock';
import {ExposureStatusType} from '../ExposureNotificationService';

import {OutbreakService, isDiagnosed} from './OutbreakService';
import {checkIns, toSeconds, addHours, subtractHours, addMinutes, subtractMinutes} from './tests/utils';

const i18n: any = {
  translate: jest.fn().mockReturnValue('foo'),
};

const bridge: any = {
  retrieveOutbreakEvents: jest.fn(),
};

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(),
}));

jest.mock('react-native-permissions', () => {
  return {checkNotifications: jest.fn().mockReturnValue(Promise.reject()), requestNotifications: jest.fn()};
});

jest.mock('react-native-background-fetch', () => {
  return {
    configure: jest.fn(),
    scheduleTask: jest.fn(),
  };
});

jest.mock('../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
  downloadDiagnosisKeysFile: jest.fn(),
}));

jest.mock('react-native-system-setting', () => {
  return {
    addBluetoothListener: jest.fn(),
    addLocationListener: jest.fn(),
  };
});

describe('OutbreakService', () => {
  let service: OutbreakService;

  beforeEach(async () => {
    service = new OutbreakService(i18n, bridge, new StorageServiceMock(), [], []);
    MockDate.set('2021-02-01T12:00Z');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('adds a checkin', async () => {
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    const checkInHistory = service.checkInHistory.get();
    expect(checkInHistory[0].id).toStrictEqual('123');
    expect(checkInHistory).toHaveLength(2);
  });

  it('removes a checkin', async () => {
    // add checkins
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.addCheckIn(checkIns[2]);

    let checkInHistory = service.checkInHistory.get();
    expect(checkInHistory[2].id).toStrictEqual('125');
    expect(checkInHistory).toHaveLength(3);

    // remove a checkin with id and timestamp
    await service.removeCheckIn(checkInHistory[2].id, checkInHistory[2].timestamp);
    checkInHistory = service.checkInHistory.get();
    expect(checkInHistory).toHaveLength(2);

    // add another checkin
    await service.addCheckIn(checkIns[3]);

    checkInHistory = service.checkInHistory.get();
    expect(checkInHistory).toHaveLength(3);
    // ensure the new item exists
    expect(checkInHistory[checkInHistory.length - 1].id).toStrictEqual(checkIns[3].id);

    // remove the latest checkin without using an id / timestamp
    await service.removeCheckIn();
    checkInHistory = service.checkInHistory.get();
    expect(checkInHistory).toHaveLength(2);
    expect(checkInHistory[checkInHistory.length - 1].id).toStrictEqual(checkIns[1].id);
  });

  it('clears checkin history', async () => {
    // add checkins
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    let checkInHistory = service.checkInHistory.get();
    expect(checkInHistory).toHaveLength(2);

    // clear the history
    await service.clearCheckInHistory();
    checkInHistory = service.checkInHistory.get();
    expect(checkInHistory).toHaveLength(0);
  });

  it('finds outbreak match', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
      ]);
    });

    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.checkForOutbreaks();

    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory).toHaveLength(1);
  });

  it('expires outbreaks', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
      ]);
    });

    MockDate.set('2021-02-01T12:00Z');
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);

    // set as exposed
    await service.checkForOutbreaks(true);
    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory[0].isExpired).toStrictEqual(false);

    // move ahead in time to ensure we're not marking as expired too soon
    MockDate.set('2021-02-05T12:00Z');
    const outbreakHistoryNotExpired = service.outbreakHistory.get();
    expect(outbreakHistoryNotExpired[0].isExpired).toStrictEqual(false);

    // move past the EXPOSURE_NOTIFICATION_CYCLE day mark
    MockDate.set('2021-02-15T13:00Z');
    await service.checkForOutbreaks(true);

    const outbreakHistoryExpired = service.outbreakHistory.get();
    expect(outbreakHistoryExpired[0].isExpired).toStrictEqual(true);

    // reset back to default
    MockDate.set('2021-02-01T12:00Z');
  });

  it('no outbreaks if checkins outside time window', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          // if outbreak started before checkin
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 24))},
          endTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
        {
          // if outbreak started after checkin
          locationId: checkIns[1].id,
          startTime: {seconds: toSeconds(addHours(checkIns[1].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[1].timestamp, 4))},
          severity: 1,
        },
      ]);
    });

    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);

    await service.checkForOutbreaks(true);

    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory).toHaveLength(0);
  });

  it('returns proper status when diagnosed', async () => {
    expect(isDiagnosed(ExposureStatusType.Monitoring)).toStrictEqual(false);
    expect(isDiagnosed(ExposureStatusType.Exposed)).toStrictEqual(false);
    expect(isDiagnosed(ExposureStatusType.Diagnosed)).toStrictEqual(true);
  });

  it('sets all outbreaks to ignored', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
        {
          locationId: checkIns[1].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[1].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[1].timestamp, 4))},
          severity: 1,
        },
      ]);
    });

    // add checkins
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.checkForOutbreaks(true);

    let outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory[0].isIgnored).toStrictEqual(false);
    expect(outbreakHistory[1].isIgnored).toStrictEqual(false);
    expect(outbreakHistory[0].isIgnoredFromHistory).toStrictEqual(false);
    expect(outbreakHistory[1].isIgnoredFromHistory).toStrictEqual(false);

    // ignore all outbreaks
    await service.ignoreAllOutbreaks();
    await service.ignoreAllOutbreaksFromHistory();
    outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory[0].isIgnored).toStrictEqual(true);
    expect(outbreakHistory[1].isIgnored).toStrictEqual(true);

    expect(outbreakHistory[0].isIgnoredFromHistory).toStrictEqual(true);
    expect(outbreakHistory[1].isIgnoredFromHistory).toStrictEqual(true);
  });

  it('sets single outbreak to ignored', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
        {
          locationId: checkIns[1].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[1].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[1].timestamp, 4))},
          severity: 1,
        },
      ]);
    });

    // add checkins
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.checkForOutbreaks(true);

    let outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory[0].isIgnored).toStrictEqual(false);
    expect(outbreakHistory[1].isIgnored).toStrictEqual(false);

    // ignore the second outbreak
    await service.ignoreOutbreak(outbreakHistory[1].id);

    outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory[1].isIgnored).toStrictEqual(true);
  });

  it('returns outbreak when 10 minute overlap', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractMinutes(checkIns[0].timestamp, 5))},
          endTime: {seconds: toSeconds(addMinutes(checkIns[0].timestamp, 5))},
          severity: 1,
        },
      ]);
    });

    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.checkForOutbreaks();

    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory).toHaveLength(1);
  });

  it('returns outbreak when 2 hour overlap', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 1))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 1))},
          severity: 1,
        },
      ]);
    });

    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.checkForOutbreaks();

    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory).toHaveLength(1);
  });

  it('returns outbreak when 1 day overlap', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 12))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 12))},
          severity: 1,
        },
      ]);
    });

    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.checkForOutbreaks();

    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory).toHaveLength(1);
  });

  it('auto deletes checkin after CHECKIN_NOTIFICATION_CYCLE', async () => {
    await service.addCheckIn(checkIns[4]);
    await service.addCheckIn(checkIns[5]);

    // day 1
    MockDate.set('2021-01-01T10:00Z');
    let checkins = service.checkInHistory.get();
    expect(checkins).toHaveLength(2);

    // checkForOutbreaks calls autoDeleteCheckinAfterPeriod
    // this would run from the background task
    await service.checkForOutbreaks();
    checkins = service.checkInHistory.get();
    expect(checkins).toHaveLength(2);

    // move past the CHECKIN_NOTIFICATION_CYCLE day mark
    MockDate.set('2021-01-30T10:00Z');
    await service.checkForOutbreaks();
    checkins = service.checkInHistory.get();
    expect(checkins).toHaveLength(0);
  });

  it('performs an outbreak check if past the min minutes threshold', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
      ]);
    });

    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);

    await service.checkForOutbreaks();
    // Current Date: 2021-02-01T12:00:00.000Z
    MockDate.set('2021-02-01T12:30Z');
    // First check 30 minutes later
    const performOutbreakCheck30Mins = await service.shouldPerformOutbreaksCheck();
    expect(performOutbreakCheck30Mins).toStrictEqual(false);

    MockDate.set('2021-02-01T15:00Z');
    // Second check 3 hours later
    const performOutbreakCheck3Hours = await service.shouldPerformOutbreaksCheck();
    expect(performOutbreakCheck30Mins).toStrictEqual(false);

    MockDate.set('2021-02-01T18:00Z');
    // third check 6 hours later
    const performOutbreakCheck6Hours = await service.shouldPerformOutbreaksCheck();
    expect(performOutbreakCheck6Hours).toStrictEqual(true);
  });
  it('performs one check returns two outbreaks', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: checkIns[0].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[0].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[0].timestamp, 4))},
          severity: 1,
        },
        {
          locationId: checkIns[1].id,
          startTime: {seconds: toSeconds(subtractHours(checkIns[1].timestamp, 2))},
          endTime: {seconds: toSeconds(addHours(checkIns[1].timestamp, 4))},
          severity: 1,
        },
      ]);
    });
    await service.checkForOutbreaks();
    await service.addCheckIn(checkIns[0]);
    await service.addCheckIn(checkIns[1]);
    await service.addCheckIn(checkIns[2]);


    MockDate.set('2021-02-01T14:30Z');
    let performOutbreakCheck = await service.shouldPerformOutbreaksCheck();
    await service.checkForOutbreaks(performOutbreakCheck);

    let outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory).toHaveLength(0);



    MockDate.set('2021-02-01T16:30Z');
     performOutbreakCheck = await service.shouldPerformOutbreaksCheck();
     await service.checkForOutbreaks(performOutbreakCheck);
     outbreakHistory = service.outbreakHistory.get();
     expect(outbreakHistory).toHaveLength(2);
    });
});
