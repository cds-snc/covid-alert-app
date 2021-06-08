// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../StorageService/tests/StorageServiceMock';

import {OutbreakService} from './OutbreakService';
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

  const OriginalDate = global.Date;
  const realDateNow = Date.now.bind(global.Date);
  const realDateUTC = Date.UTC.bind(global.Date);
  const dateSpy = jest.spyOn(global, 'Date');
  const today = new OriginalDate('2021-02-01T12:00Z');
  global.Date.now = realDateNow;
  global.Date.UTC = realDateUTC;

  beforeEach(async () => {
    service = new OutbreakService(i18n, bridge, new StorageServiceMock(), [], []);
    // @ts-ignore
    dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
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

  it('check for outbreaks', async () => {
    jest.spyOn(service, 'extractOutbreakEventsFromZipFiles').mockImplementation(async () => {
      return service.convertOutbreakEvents([
        {
          locationId: '123',
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
    console.log('outbreakHistory', outbreakHistory);
    expect(false).toStrictEqual(true);
  });
});
