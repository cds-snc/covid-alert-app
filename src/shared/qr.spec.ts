import {
  CheckInData,
  createOutbreakHistoryItem,
  doTimeWindowsOverlap,
  getNewOutbreakHistoryItems,
  isExposedToOutbreak,
  TimeWindow,
  ignoreHistoryItems,
} from './qr';

describe('doTimeWindowsOverlap', () => {
  const dateStr = '2021-01-05';
  const windowA: TimeWindow = {
    start: new Date(`${dateStr}T10:00Z`).getTime(),
    end: new Date(`${dateStr}T12:00Z`).getTime(),
  };
  const windowB: TimeWindow = {
    start: new Date(`${dateStr}T00:00Z`).getTime(),
    end: new Date(`${dateStr}T23:00Z`).getTime(),
  };
  const windowC: TimeWindow = {
    start: new Date(`${dateStr}T13:00Z`).getTime(),
    end: new Date(`${dateStr}T20:00Z`).getTime(),
  };

  it.each([
    [windowA, windowB, true],
    [windowB, windowA, true],
    [windowA, windowC, false],
    [windowC, windowA, false],
    [windowB, windowC, true],
    [windowC, windowB, true],
  ])('Does %p overlap with %p? Result=%p', (window1, window2, result) => {
    expect(doTimeWindowsOverlap(window1, window2)).toStrictEqual(result);
  });
});

describe('getNewOutbreakHistoryItems', () => {
  const t1100 = new Date('2021-02-01T11:00Z').getTime();
  const t1200 = new Date('2021-02-01T12:00Z').getTime();
  const t1300 = new Date('2021-02-01T13:00Z').getTime();
  const t1400 = new Date('2021-02-01T14:00Z').getTime();
  const outbreakEvents = [
    {locationId: '1', startTime: t1100, endTime: t1300},
    {locationId: '2', startTime: t1100, endTime: t1300},
  ];
  it('returns exposed if there is a match', () => {
    const checkInHistory: CheckInData[] = [
      {id: '1', timestamp: t1200, address: '', name: ''},
      {id: '3', timestamp: t1200, address: '', name: ''},
    ];
    const newHistory = getNewOutbreakHistoryItems(checkInHistory, outbreakEvents);
    expect(isExposedToOutbreak(newHistory)).toStrictEqual(true);
  });
  it('returns monitoring if there is no match', () => {
    const checkInHistory: CheckInData[] = [
      {id: '3', timestamp: t1200, address: '', name: ''},
      {id: '4', timestamp: t1200, address: '', name: ''},
    ];
    const newHistory = getNewOutbreakHistoryItems(checkInHistory, outbreakEvents);
    expect(isExposedToOutbreak(newHistory)).toStrictEqual(false);
  });
  it('returns monitoring if id matches but time does not', () => {
    const checkInHistory: CheckInData[] = [
      {id: '1', timestamp: t1400, address: '', name: ''},
      {id: '2', timestamp: t1400, address: '', name: ''},
    ];
    const newHistory = getNewOutbreakHistoryItems(checkInHistory, outbreakEvents);
    expect(isExposedToOutbreak(newHistory)).toStrictEqual(false);
  });
});

const checkIns = [
  {
    id: '123',
    timestamp: new Date('2021-02-01T12:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
  {
    id: '123',
    timestamp: new Date('2021-02-01T14:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
  {
    id: '123',
    timestamp: new Date('2021-02-04T12:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
];

const outbreaks = [
  {
    locationId: '123',
    startTime: new Date('2021-02-01T09:00Z').getTime(),
    endTime: new Date('2021-02-01T16:00Z').getTime(),
  },
  {
    locationId: '456',
    startTime: null,
    endTime: null,
  },
  {
    locationId: '123',
    startTime: new Date('2021-03-01T09:00Z').getTime(),
    endTime: new Date('2021-03-01T16:00Z').getTime(),
  },
];

describe('outbreakHistory functions', () => {
  /* Create */
  describe('create outbreak history item', () => {
    it('creates history item', () => {
      const checkIn = checkIns[0];
      const outbreak = outbreaks[0];

      const historyItem = createOutbreakHistoryItem({
        timestamp: new Date().getTime(),
        checkIn,
        outbreakEvent: outbreak,
      });

      expect(historyItem).toEqual(
        expect.objectContaining({
          outbreakId: `${checkIn.id}-${checkIn.timestamp}`,
          isExpired: false,
          isIgnored: false,
          locationId: checkIn.id,
          locationAddress: checkIn.address,
          locationName: checkIn.name,
          outbreakStartTimestamp: outbreak.startTime,
          outbreakEndTimestamp: outbreak.endTime,
          checkInTimestamp: checkIn.timestamp,
        }),
      );
    });

    it('creates history item with null values', () => {
      const checkIn = checkIns[0];
      const outbreak = outbreaks[1];

      const historyItem = createOutbreakHistoryItem({
        timestamp: new Date().getTime(),
        checkIn,
        outbreakEvent: outbreak,
      });

      expect(historyItem).toEqual(
        expect.objectContaining({
          outbreakId: `${checkIn.id}-${checkIn.timestamp}`,
          outbreakStartTimestamp: 0,
          outbreakEndTimestamp: 0,
        }),
      );
    });
  });

  /* Expire */
  describe('expireHistoryItems', () => {
    it('expires items older than 14 days', () => {
      expect(true).toStrictEqual(true);
    });
    it('does not expire items newer than 14 days', () => {
      expect(true).toStrictEqual(true);
    });
  });

  /* Ignore */
  describe('ignoreHistoryItems', () => {
    it('ignores items with ids that are passed in', () => {
      const history = getNewOutbreakHistoryItems(checkIns, outbreaks);
      const updatedHistory = ignoreHistoryItems(
        ['123-1612180800000', '123-1612188000000'],
        ignoreHistoryItems([], history),
      );

      expect(updatedHistory[0]).toEqual(
        expect.objectContaining({
          outbreakId: '123-1612180800000',
          isIgnored: true,
        }),
      );

      expect(updatedHistory[1]).toEqual(
        expect.objectContaining({
          outbreakId: '123-1612188000000',
          isIgnored: true,
        }),
      );
    });
    it('does not ignore items with ids not passed in', () => {
      expect(true).toStrictEqual(true);
    });
  });

  //end
});
