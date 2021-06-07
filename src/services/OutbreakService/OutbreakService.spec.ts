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
    isExpired: true,
    isIgnored: false,
    isIgnoredFromHistory: false,
    locationId: 'location124',
    locationAddress: '123 King St.',
    locationName: 'Location name',
    outbreakStartTimestamp: new Date('2021-05-22T12:00Z').getTime(),
    outbreakEndTimestamp: new Date('2021-05-22T23:00Z').getTime(),
    checkInTimestamp: new Date('2021-05-22T12:30Z').getTime(),
    notificationTimestamp: new Date('2021-05-22T22:00Z').getTime(),
    severity: 1,
  },

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
  const today = new OriginalDate('2020-05-18T04:10:00+0000');
  global.Date.now = realDateNow;
  global.Date.UTC = realDateUTC;

  beforeEach(async () => {
    service = await OutbreakService.sharedInstance(i18n, bridge);
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

  it('expire history items and save', async () => {

    await service.addToOutbreakHistory(outbreaks)
    const outbreakHistory = service.outbreakHistory.get()
    await service.expireHistoryItemsAndSave(outbreakHistory);

    console.log('outbreakHistory', outbreakHistory);
  })
});
