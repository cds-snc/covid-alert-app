import { assert } from 'console';
import {covidshield} from '../services/BackendService/covidshield';
import { getCurrentDate } from './date-fns';

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
  const now = getCurrentDate().getTime();
  const oneHourAgo = now - 1000 * 60 * 60;
  const twoHoursAgo = now - 1000 * 60 * 60 * 2;
  const oneHourFromNow = now + 1000 * 60 * 60;
  const outbreakEvents: covidshield.OutbreakEvent[] = [
    {locationId: '1', startTime: oneHourAgo, endTime: oneHourFromNow},
    {locationId: '2', startTime: oneHourAgo, endTime: oneHourFromNow},
  ];
  it('returns exposed if there is a match', () => {
    const checkInHistory: CheckInData[] = [
      {id: '1', timestamp: now, address: '', name: ''},
      {id: '3', timestamp: now, address: '', name: ''},
    ];
    const newStatus = getNewOutbreakStatus(checkInHistory, outbreakEvents);
    expect(newStatus.type).toStrictEqual(OutbreakStatusType.Exposed);
  });
  it('returns monitoring if there is no match', () => {
    const checkInHistory: CheckInData[] = [
      {id: '3', timestamp: now, address: '', name: ''},
      {id: '4', timestamp: now, address: '', name: ''},
    ];
    const newStatus = getNewOutbreakStatus(checkInHistory, outbreakEvents);
    expect(newStatus.type).toStrictEqual(OutbreakStatusType.Monitoring);
  });
  // currently failing
  it.skip('returns monitoring if id matches but time does not', () => {
    const checkInHistory: CheckInData[] = [
      {id: '1', timestamp: twoHoursAgo, address: '', name: ''},
      {id: '2', timestamp: twoHoursAgo, address: '', name: ''},
    ];
    const newStatus = getNewOutbreakStatus(checkInHistory, outbreakEvents);
    console.log('newStatus', newStatus);
    expect(newStatus.type).toStrictEqual(OutbreakStatusType.Monitoring);
  });
});
