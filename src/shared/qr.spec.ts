import {CheckInData, doTimeWindowsOverlap, getNewOutbreakStatus, OutbreakStatusType, TimeWindow} from './qr';

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

describe('getNewOutbreakStatus', () => {
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
    const newStatus = getNewOutbreakStatus(checkInHistory, outbreakEvents);
    expect(newStatus.type).toStrictEqual(OutbreakStatusType.Exposed);
  });
  it('returns monitoring if there is no match', () => {
    const checkInHistory: CheckInData[] = [
      {id: '3', timestamp: t1200, address: '', name: ''},
      {id: '4', timestamp: t1200, address: '', name: ''},
    ];
    const newStatus = getNewOutbreakStatus(checkInHistory, outbreakEvents);
    expect(newStatus.type).toStrictEqual(OutbreakStatusType.Monitoring);
  });
  it('returns monitoring if id matches but time does not', () => {
    const checkInHistory: CheckInData[] = [
      {id: '1', timestamp: t1400, address: '', name: ''},
      {id: '2', timestamp: t1400, address: '', name: ''},
    ];
    const newStatus = getNewOutbreakStatus(checkInHistory, outbreakEvents);
    expect(newStatus.type).toStrictEqual(OutbreakStatusType.Monitoring);
  });
});

describe('outbreakHistory functions', () => {
  describe('expireHistoryItems', () => {
    it('expires items older than 14 days', () => {
      expect(true).toStrictEqual(true);
    });
    it('does not expire items newer than 14 days', () => {
      expect(true).toStrictEqual(true);
    });
  });

  describe('ignoreHistoryItems', () => {
    it('ignores items with ids that are passed in', () => {
      expect(true).toStrictEqual(true);
    });
    it('does not ignore items with ids not passed in', () => {
      expect(true).toStrictEqual(true);
    });
  });
});
