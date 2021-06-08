// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../StorageService/tests/StorageServiceMock';

import {OutbreakService} from './OutbreakService';
import {checkIns, addHours, subtractHours} from './tests/utils';
import MockDate from 'mockdate';

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

    // remove a checkin
    await service.removeCheckIn(checkInHistory[2].id, checkInHistory[2].timestamp);
    checkInHistory = service.checkInHistory.get();
    expect(checkInHistory).toHaveLength(2);
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

    await service.checkForOutbreaks(true);
    const outbreakHistory = service.outbreakHistory.get();
    expect(outbreakHistory[0].isExpired).toStrictEqual(false);

    MockDate.set('2021-02-15T13:00Z');
    await service.checkForOutbreaks(true);

    const outbreakHistoryExpired = service.outbreakHistory.get();

    expect(outbreakHistoryExpired[0].isExpired).toStrictEqual(true);

    MockDate.set('2021-02-01T12:00Z');
  });

  //
});
