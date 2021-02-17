import {OUTBREAK_LOCATIONS_URL} from 'env';
import {log} from 'shared/logging/config';
import {covidshield} from 'services/BackendService/covidshield';

import {getCurrentDate, hoursFromNow} from './date-fns';
import { EXPOSURE_NOTIFICATION_CYCLE } from 'services/ExposureNotificationService';

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

interface MatchData {
  id: string;
  outbreakEvents: covidshield.OutbreakEvent[];
  checkInData: CheckInData[];
  matchCount?: number;
  matchedCheckIns?: CheckInData[];
  mostRecentCheckOut?: number;
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
    const hoursSinceCheckIn = -1 * hoursFromNow(new Date(historyItem.checkInTimestamp));
    if (hoursSinceCheckIn > 24 * EXPOSURE_NOTIFICATION_CYCLE) {
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

export const isExposed = (outbreakHistory: OutbreakHistoryItem[]) => {
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

export const getNewOutbreakStatus = (
  checkInHistory: CheckInData[],
  outbreakEvents: covidshield.OutbreakEvent[],
): OutbreakStatus => {
  log.debug({message: 'fetching outbreak locations', payload: {outbreakEvents}});
  const outbreakIds = outbreakEvents.map(event => event.locationId);

  const checkInLocationMatches = checkInHistory.filter(checkIn => {
    if (outbreakIds.indexOf(checkIn.id) > -1) {
      return true;
    }
    return false;
  });

  if (checkInLocationMatches.length === 0) {
    return createOutbreakStatus({exposed: false});
  }
  const matchedOutbreakIdsNotUnique = checkInLocationMatches.map(data => data.id);
  const matchedOutbreakIds = Array.from(new Set(matchedOutbreakIdsNotUnique));

  const matches = getMatches({outbreakEvents, checkInHistory, matchedOutbreakIds});

  log.debug({message: 'outbreak matches', payload: {matches}});

  return createOutbreakStatus({exposed: matches.length > 0});
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

  const matchData = _matchData.map(data => processMatchData(data));
  const matches = matchData.filter(data => data.matchCount > 0);
  return matches;
};

const processMatchData = (matchData: MatchData) => {
  let matchCount = 0;
  const matchedCheckIns = [];
  for (const checkIn of matchData.checkInData) {
    for (const outbreak of matchData.outbreakEvents) {
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
        matchCount += 1;
        matchedCheckIns.push(checkIn);
      }
    }
  }
  return {...matchData, matchCount, matchedCheckIns};
};
