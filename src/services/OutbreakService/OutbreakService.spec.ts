// eslint-disable-next-line @shopify/strict-component-boundaries
import {StorageServiceMock} from '../StorageService/tests/StorageServiceMock';

import {OutbreakService} from './OutbreakService';

const checkIns = [
  {
    id: '123',
    timestamp: new Date('2021-02-01T12:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
  {
    id: '124',
    timestamp: new Date('2021-02-01T14:00Z').getTime(),
    address: '124 King St.',
    name: 'Location name',
  },
  {
    id: '125',
    timestamp: new Date('2021-02-04T12:00Z').getTime(),
    address: '125 King St.',
    name: 'Location name',
  },
];

const outbreaks = [
  {
    id: '123',
    isExpired: false,
    isIgnored: false,
    isIgnoredFromHistory: false,
    locationId: 'location123',
    locationAddress: '123 King St.',
    locationName: 'Location name',
    outbreakStartTimestamp: new Date('2021-06-06T12:00Z').getTime(),
    outbreakEndTimestamp: new Date('2021-06-06T23:00Z').getTime(),
    checkInTimestamp: new Date('2021-06-06T12:30Z').getTime(),
    notificationTimestamp: new Date('2021-06-06T22:00Z').getTime(),
    severity: 1,
  },
  {
    id: '124',
    isExpired: false,
    isIgnored: false,
    isIgnoredFromHistory: false,
    locationId: 'location124',
    locationAddress: '123 King St.',
    locationName: 'Location name',
    outbreakStartTimestamp: new Date('2021-02-01T15:00Z').getTime(),
    outbreakEndTimestamp: new Date('2021-02-01T23:00Z').getTime(),
    checkInTimestamp: new Date('2021-02-01T14:00Z').getTime(),
    notificationTimestamp: new Date('2021-02-01T22:00Z').getTime(),
    severity: 1,
  },
  {
    id: '126',
    isExpired: false,
    isIgnored: false,
    isIgnoredFromHistory: false,
    locationId: '123',
    locationAddress: '123 King St. 126',
    locationName: 'Location name',
    outbreakStartTimestamp: new Date('2021-06-06T12:00Z').getTime(),
    outbreakEndTimestamp: new Date('2021-06-06T23:00Z').getTime(),
    checkInTimestamp: new Date('2021-06-06T12:30Z').getTime(),
    notificationTimestamp: new Date('2021-06-06T20:00Z').getTime(),
    severity: 2,
  }

]

const i18n: any = {
  translate: jest.fn().mockReturnValue('foo'),
};

const bridge: any = {
  retrieveOutbreakEvents: jest.fn().mockResolvedValue(undefined),
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
  const today = new OriginalDate('2021-02-01T04:10:00+0000');
  console.log('today', today.getTime());
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

  it('expire history items and save', async () => {

    await service.addToOutbreakHistory(outbreaks)
    const outbreakHistory = service.outbreakHistory.get()
    const convertedOutbreaks = service.convertOutbreakEvents(outbreaks)
    console.log('convertOutbreakEvents', convertedOutbreaks);
    await service.expireHistoryItemsAndSave(outbreakHistory);

    expect(outbreakHistory).toHaveLength(2);
  })

  it('check for outbreaks', async () => {
    await service.checkForOutbreaks();
    const outbreakHistory = service.outbreakHistory.get();
  })
});
