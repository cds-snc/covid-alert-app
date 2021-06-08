import MockDate from 'mockdate';

// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../StorageService/tests/StorageServiceMock';
import {ExposureStatusType} from '../ExposureNotificationService';

import {OutbreakService, isDiagnosed} from './OutbreakService';
import {checkIns, addHours, subtractHours} from './tests/utils';

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
          startTime: {seconds: subtractHours(checkIns[0].timestamp, 2) / 1000},
          endTime: {seconds: addHours(checkIns[0].timestamp, 4) / 1000},
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
          startTime: {seconds: subtractHours(checkIns[0].timestamp, 2) / 1000},
          endTime: {seconds: addHours(checkIns[0].timestamp, 4) / 1000},
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
          startTime: {seconds: subtractHours(checkIns[0].timestamp, 24) / 1000},
          endTime: {seconds: subtractHours(checkIns[0].timestamp, 4) / 1000},
          severity: 1,
        },
        {
          // if outbreak started after checkin
          locationId: checkIns[1].id,
          startTime: {seconds: addHours(checkIns[1].timestamp, 2) / 1000},
          endTime: {seconds: addHours(checkIns[1].timestamp, 4) / 1000},
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
          startTime: {seconds: subtractHours(checkIns[0].timestamp, 2) / 1000},
          endTime: {seconds: addHours(checkIns[0].timestamp, 4) / 1000},
          severity: 1,
        },
        {
          locationId: checkIns[1].id,
          startTime: {seconds: subtractHours(checkIns[1].timestamp, 2) / 1000},
          endTime: {seconds: addHours(checkIns[1].timestamp, 4) / 1000},
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
});
