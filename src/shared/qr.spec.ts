import {
  CheckInData,
  createOutbreakHistoryItem,
  doTimeWindowsOverlap,
  getMatchedOutbreakHistoryItems,
  isExposedToOutbreak,
  TimeWindow,
  ignoreHistoryItems,
  getNewOutbreakExposures,
  expireHistoryItems,
  OutbreakHistoryItem,
} from './qr';

const getTimes = (startTimestamp, durationInMinutes: number) => {
  const endTime = new Date(startTimestamp);
  endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
  return {start: startTimestamp, end: endTime.getTime()};
};

const getOutbreakId = checkIn => {
  return `${checkIn.id}-${checkIn.timestamp}`;
};

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
  ])('does %p overlap with %p? Result=%p', (window1, window2, result) => {
    expect(doTimeWindowsOverlap(window1, window2)).toStrictEqual(result);
  });
});

describe('getMatchedOutbreakHistoryItems', () => {
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
    const history = getMatchedOutbreakHistoryItems(checkInHistory, outbreakEvents);
    expect(isExposedToOutbreak(history)).toStrictEqual(true);
  });

  it('returns not exposed if isIgnored or expired', () => {
    const history = {
      outbreakId: '123-1612180800000',
      isExpired: false,
      isIgnored: false,
      locationId: '123',
      locationAddress: '123 King St.',
      locationName: 'Location name',
      outbreakStartTimestamp: 1612170000000,
      outbreakEndTimestamp: 1612195200000,
      checkInTimestamp: 1612180800000,
      notificationTimestamp: 1613758680944,
    };

    expect(isExposedToOutbreak([history])).toStrictEqual(true);
    expect(isExposedToOutbreak([{...history, isExpired: true}])).toStrictEqual(false);
    expect(isExposedToOutbreak([{...history, isIgnored: true}])).toStrictEqual(false);
  });
  //

  it('returns monitoring if there is no match', () => {
    const checkInHistory: CheckInData[] = [
      {id: '3', timestamp: t1200, address: '', name: ''},
      {id: '4', timestamp: t1200, address: '', name: ''},
    ];
    const newHistory = getMatchedOutbreakHistoryItems(checkInHistory, outbreakEvents);
    expect(isExposedToOutbreak(newHistory)).toStrictEqual(false);
  });
  it('returns monitoring if id matches but time does not', () => {
    const checkInHistory: CheckInData[] = [
      {id: '1', timestamp: t1400, address: '', name: ''},
      {id: '2', timestamp: t1400, address: '', name: ''},
    ];
    const newHistory = getMatchedOutbreakHistoryItems(checkInHistory, outbreakEvents);
    expect(isExposedToOutbreak(newHistory)).toStrictEqual(false);
  });
});

describe('outbreakHistory functions', () => {
  // Create
  describe('create outbreak history item', () => {
    it('creates history item', () => {
      const checkIn = checkIns[0];
      const outbreak = outbreaks[0];

      const historyItem = createOutbreakHistoryItem({
        timestamp: new Date().getTime(),
        checkIn,
        outbreakEvent: outbreak,
      });

      expect(historyItem).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIn),
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

      expect(historyItem).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIn),
          outbreakStartTimestamp: 0,
          outbreakEndTimestamp: 0,
        }),
      );
    });
  });

  // Expire
  describe('expireHistoryItems', () => {
    it('expires items older than 14 days', () => {
      const OriginalDate = global.Date;
      const realDateNow = Date.now.bind(global.Date);
      const today = new OriginalDate('2021-02-01T12:00Z');
      const dateSpy = jest.spyOn(global, 'Date');
      // @ts-ignore
      dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : today));
      global.Date.now = realDateNow;

      const checkIns = [
        {
          id: '123',
          timestamp: today.getTime() - 15 * 3600 * 24 * 1000,
          address: '123 King St.',
          name: 'Location name',
        },
        {
          id: '123',
          timestamp: today.getTime() - 14 * 3600 * 24 * 1000,
          address: '123 King St.',
          name: 'Location name',
        },
        {
          id: '123',
          timestamp: today.getTime() - 2 * 3600 * 24 * 1000,
          address: '123 King St.',
          name: 'Location name 3',
        },
      ];

      const outbreak1 = getTimes(today.getTime() - 15 * 3600 * 24 * 1000, 20);
      const outbreak2 = getTimes(today.getTime() - 2 * 3600 * 24 * 1000, 20);

      const outbreaks = [
        {
          locationId: '123',
          startTime: outbreak1.start,
          endTime: outbreak1.end,
        },
        {
          locationId: '123',
          startTime: outbreak2.start,
          endTime: outbreak2.end,
        },
      ];

      const matchedHistory = getMatchedOutbreakHistoryItems(checkIns, outbreaks);

      const history = expireHistoryItems(matchedHistory);

      expect(history[0]).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIns[0]),
          isExpired: true,
        }),
      );

      expect(history[1]).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIns[2]),
          isExpired: false,
        }),
      );
    });
  });

  // Ignore
  describe('ignoreHistoryItems', () => {
    it('ignores items with ids that are passed in', () => {
      const history = getMatchedOutbreakHistoryItems(checkIns, outbreaks);
      const updatedHistory = ignoreHistoryItems(
        [getOutbreakId(checkIns[0]), getOutbreakId(checkIns[1])],
        ignoreHistoryItems([], history),
      );

      expect(updatedHistory[0]).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIns[0]),
          isIgnored: true,
        }),
      );

      expect(updatedHistory[1]).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIns[1]),
          isIgnored: true,
        }),
      );
    });

    it('does not ignore items with ids not passed in', () => {
      const history = getMatchedOutbreakHistoryItems(checkIns, outbreaks);
      const updatedHistory = ignoreHistoryItems([getOutbreakId(checkIns[0])], history);

      expect(updatedHistory[0]).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIns[0]),
          isIgnored: true,
        }),
      );

      expect(updatedHistory[1]).toStrictEqual(
        expect.objectContaining({
          outbreakId: getOutbreakId(checkIns[1]),
          isIgnored: false,
        }),
      );
    });
  });

  // New Outbreaks
  describe('getNewOutbreakExposures', () => {
    it('returns only new exposure', () => {
      const item: OutbreakHistoryItem = {
        outbreakId: '123-1612180800001',
        isExpired: false,
        isIgnored: false,
        locationId: '123',
        locationAddress: '123 King St.',
        locationName: 'Location name',
        outbreakStartTimestamp: 1612170000000,
        outbreakEndTimestamp: 1612195200000,
        checkInTimestamp: 1612180800001,
        notificationTimestamp: 1613758680944,
      };

      const history = getMatchedOutbreakHistoryItems(checkIns, outbreaks);

      // should return 0 items
      const items = getNewOutbreakExposures([history[0]], history);
      expect(items).toHaveLength(0);

      // should return only new item
      const newItems = getNewOutbreakExposures([item], history);
      expect(newItems).toHaveLength(1);
      expect(newItems[0]).toStrictEqual(
        expect.objectContaining({
          outbreakId: '123-1612180800001',
        }),
      );
    });
  });

  // end
});
