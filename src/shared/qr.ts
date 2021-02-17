import {OUTBREAK_LOCATIONS_URL} from 'env';
import {log} from 'shared/logging/config';
import {covidshield} from 'services/BackendService/covidshield';

import {getCurrentDate, getHoursBetween} from './date-fns';
import {getRandomString} from './logging/uuid';

export const OUTBREAK_EXPOSURE_DURATION_DAYS = 14;

export interface CheckInData {
  id: string;
  name: string;
  address: string;
  timestamp: number;
}

export enum OutbreakStatusType {
  Monitoring = 'monitoring',
  Exposed = 'exposed',
}

export interface OutbreakStatus {
  type: OutbreakStatusType;
  lastChecked: number;
}

export interface TimeWindow {
  start: number;
  end: number;
}

interface MatchCalculationData {
  id: string;
  outbreakEvents: covidshield.OutbreakEvent[];
  checkInData: CheckInData[];
}

interface MatchData {
  timestamp: number;
  checkInData: CheckInData;
  outbreakEvent: covidshield.OutbreakEvent;
}

export interface OutbreakHistoryItem {
  outbreakId: string /* unique to your checkin during the outbreak event */;
  isExpired: boolean /* after 14 days the outbreak expires */;
  isIgnored: boolean /* if user has a negative test result */;
  locationId: string;
  locationAddress: string;
  locationName: string;
  outbreakStartTimestamp: number;
  outbreakEndTimestamp: number;
  checkInTimestamp: number;
  notificationTimestamp: number;
}

/** returns a new outbreakHistory with the `isExpired` property updated */
export const expireHistoryItems = (outbreakHistory: OutbreakHistoryItem[]): OutbreakHistoryItem[] => {
  return outbreakHistory.map(historyItem => {
    if (historyItem.isExpired) {
      return {...historyItem};
    }
    const hoursSinceCheckIn = getHoursBetween(new Date(historyItem.checkInTimestamp), getCurrentDate());
    if (hoursSinceCheckIn > 24 * OUTBREAK_EXPOSURE_DURATION_DAYS) {
      return {...historyItem, isExpired: true};
    }
    return {...historyItem};
  });
};

/** returns a new outbreakHistory with the `isIgnored` property updated */
export const ignoreHistoryItems = (
  outbreakIds: string[],
  outbreakHistory: OutbreakHistoryItem[],
): OutbreakHistoryItem[] => {
  return outbreakHistory.map(historyItem => {
    if (outbreakIds.indexOf(historyItem.outbreakId) > -1) {
      return {...historyItem, isIgnored: true};
    }
    return {...historyItem};
  });
};

export const isExposedToOutbreak = (outbreakHistory: OutbreakHistoryItem[]) => {
  const currentOutbreakHistory = outbreakHistory.filter(outbreak => {
    if (outbreak.isExpired || outbreak.isIgnored) {
      return false;
    }
    return true;
  });

  if (currentOutbreakHistory.length > 0) {
    return true;
  }
  return false;
};

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const initialOutbreakStatus = {type: OutbreakStatusType.Monitoring, lastChecked: 0};

export const getOutbreakEvents = async (): Promise<covidshield.OutbreakEvent[]> => {
  const fetchedData = await fetch(OUTBREAK_LOCATIONS_URL, {
    method: 'GET',
  });
  const data = await fetchedData.json();
  return data.exposedLocations;
};

export const getNewOutbreakHistoryItems = (
  checkInHistory: CheckInData[],
  outbreakEvents: covidshield.OutbreakEvent[],
): OutbreakHistoryItem[] => {
  log.debug({message: 'fetching outbreak locations', payload: {outbreakEvents}});
  const outbreakIds = outbreakEvents.map(event => event.locationId);

  const checkInLocationMatches = checkInHistory.filter(checkIn => {
    if (outbreakIds.indexOf(checkIn.id) > -1) {
      return true;
    }
    return false;
  });

  if (checkInLocationMatches.length === 0) {
    return [];
  }
  const matchedOutbreakIdsNotUnique = checkInLocationMatches.map(data => data.id);
  const matchedOutbreakIds = Array.from(new Set(matchedOutbreakIdsNotUnique));

  const matches = getMatches({outbreakEvents, checkInHistory, matchedOutbreakIds});

  log.debug({message: 'outbreak matches', payload: {matches}});

  return matches.map(match => createOutbreakHistoryItem(match));
};

export const createOutbreakStatus = ({exposed}: {exposed: boolean}) => {
  const newOutbreakStatus: OutbreakStatus = {
    type: exposed ? OutbreakStatusType.Exposed : OutbreakStatusType.Monitoring,
    lastChecked: getCurrentDate().getTime(),
  };
  return newOutbreakStatus;
};

export const doTimeWindowsOverlap = (window1: TimeWindow, window2: TimeWindow) => {
  if (window1.start >= window2.start && window1.start <= window2.end) {
    return true;
  }
  if (window1.end >= window2.start && window1.end <= window2.end) {
    return true;
  }
  if (window2.start >= window1.start && window2.start <= window1.end) {
    return true;
  }
  if (window2.end >= window1.start && window2.end <= window1.end) {
    return true;
  }
  return false;
};

export const getMatches = ({
  outbreakEvents,
  checkInHistory,
  matchedOutbreakIds,
}: {
  outbreakEvents: covidshield.OutbreakEvent[];
  checkInHistory: CheckInData[];
  matchedOutbreakIds: string[];
}): MatchData[] => {
  const relevantOutbreakData = outbreakEvents.filter(location => matchedOutbreakIds.indexOf(location.locationId) > -1);
  const relevantCheckInData = checkInHistory.filter(data => matchedOutbreakIds.indexOf(data.id) > -1);

  const _matchData = matchedOutbreakIds.map(id => {
    return {
      id,
      outbreakEvents: relevantOutbreakData.filter(data => data.locationId === id),
      checkInData: relevantCheckInData.filter(data => data.id === id),
    };
  });

  const matchArrays = _matchData.map(data => processMatchData(data));
  return flattened(matchArrays);
};

const flattened = (arr: any[]) => [].concat(...arr);

const processMatchData = (matchCalucationData: MatchCalculationData) => {
  const matches: MatchData[] = [];
  for (const checkIn of matchCalucationData.checkInData) {
    for (const outbreak of matchCalucationData.outbreakEvents) {
      if (!outbreak.startTime || !outbreak.endTime) {
        continue;
      }
      const window1: TimeWindow = {
        start: checkIn.timestamp,
        end: checkIn.timestamp + ONE_HOUR_IN_MS,
      };
      const window2: TimeWindow = {
        start: Number(outbreak.startTime),
        end: Number(outbreak.endTime),
      };
      if (doTimeWindowsOverlap(window1, window2)) {
        const match: MatchData = {
          timestamp: checkIn.timestamp,
          checkInData: checkIn,
          outbreakEvent: outbreak,
        };
        matches.push(match);
      }
    }
  }
  return matches;
};

export const createOutbreakHistoryItem = (matchData: MatchData): OutbreakHistoryItem => {
  const newItem: OutbreakHistoryItem = {
    outbreakId: getRandomString(10),
    isExpired: false,
    isIgnored: false,
    locationId: matchData.checkInData.id,
    locationAddress: matchData.checkInData.address,
    locationName: matchData.checkInData.name,
    outbreakStartTimestamp: Number(matchData.outbreakEvent.startTime),
    outbreakEndTimestamp: Number(matchData.outbreakEvent.endTime),
    checkInTimestamp: matchData.checkInData.timestamp,
    notificationTimestamp: getCurrentDate().getTime() /* revisit */,
  };
  return newItem;
};
