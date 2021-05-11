import {OutbreakEvent} from 'services/OutbreakService';
import {log} from 'shared/logging/config';

import {getCurrentDate, getHoursBetween} from './date-fns';

export const OUTBREAK_EXPOSURE_DURATION_DAYS = 14;

export enum OutbreakSeverity {
  SelfMonitor = 1,
  SelfIsolate = 2,
  GetTested = 3,
}

export enum ExposureType {
  Proximity = 'proximity',
  Outbreak = 'outbreak',
}

export interface CheckInData {
  id: string;
  name: string;
  address: string;
  timestamp: number;
}

export interface ExposureHistoryData {
  id: string;
  name: string;
  timestamp: number;
}

export interface TimeWindow {
  start: number;
  end: number;
}

interface MatchCalculationData {
  locationId: string;
  outbreakEvents: OutbreakEvent[];
  checkIns: CheckInData[];
}

interface MatchData {
  timestamp: number;
  checkIn: CheckInData;
  outbreakEvent: OutbreakEvent;
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
  severity: OutbreakSeverity;
}

export interface CombinedExposureHistoryData {
  timestamp: number;
  exposureType: ExposureType;
  subtitle: string;
  historyItem?: OutbreakHistoryItem;
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

export const getCurrentOutbreakHistory = (outbreakHistory: OutbreakHistoryItem[]) => {
  return outbreakHistory.filter(outbreak => {
    if (outbreak.isExpired || outbreak.isIgnored) {
      return false;
    }
    return true;
  });
};

export const isExposedToOutbreak = (outbreakHistory: OutbreakHistoryItem[]) => {
  const currentOutbreakHistory = getCurrentOutbreakHistory(outbreakHistory);

  if (currentOutbreakHistory.length > 0) {
    return true;
  }
  return false;
};

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const getMatchedOutbreakHistoryItems = (
  checkInHistory: CheckInData[],
  outbreakEvents: OutbreakEvent[],
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

  const allMatches = getMatches({outbreakEvents, checkInHistory, matchedOutbreakIds});

  log.debug({message: 'outbreak matches', payload: {allMatches}});

  const matchTimestampDict = getMatchTimestampDict(allMatches);
  const filteredMatches = allMatches.filter(match => filterDuplicateMatches(match, matchTimestampDict));
  return filteredMatches.map(match => createOutbreakHistoryItem(match));
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
  outbreakEvents: OutbreakEvent[];
  checkInHistory: CheckInData[];
  matchedOutbreakIds: string[];
}): MatchData[] => {
  const relevantOutbreakData = outbreakEvents.filter(location => matchedOutbreakIds.indexOf(location.locationId) > -1);
  const relevantCheckInData = checkInHistory.filter(data => matchedOutbreakIds.indexOf(data.id) > -1);

  const _matchData = matchedOutbreakIds.map(id => {
    return {
      locationId: id,
      outbreakEvents: relevantOutbreakData.filter(data => data.locationId === id),
      checkIns: relevantCheckInData.filter(data => data.id === id),
    };
  });

  const matchArrays = _matchData.map(data => processMatchData(data));
  return flattened(matchArrays);
};

const flattened = (arr: any[]) => [].concat(...arr);

const processMatchData = (matchCalucationData: MatchCalculationData) => {
  const matches: MatchData[] = [];
  for (const checkIn of matchCalucationData.checkIns) {
    for (const outbreak of matchCalucationData.outbreakEvents) {
      if (!outbreak.startTime || !outbreak.endTime) {
        continue;
      }
      const window1: TimeWindow = {
        start: checkIn.timestamp,
        end: checkIn.timestamp + ONE_HOUR_IN_MS,
      };
      const window2: TimeWindow = timeWindowFromOutbreakEvent(outbreak);
      if (doTimeWindowsOverlap(window1, window2)) {
        const match: MatchData = {
          timestamp: checkIn.timestamp,
          checkIn,
          outbreakEvent: outbreak,
        };
        matches.push(match);
      }
    }
  }
  return matches;
};

const timeWindowFromOutbreakEvent = (outbreak: OutbreakEvent) => {
  return {
    start: Number(outbreak.startTime),
    end: Number(outbreak.endTime),
  };
};

export const createOutbreakHistoryItem = (matchData: MatchData): OutbreakHistoryItem => {
  const locationId = matchData.checkIn.id;
  const checkInTimestamp = matchData.checkIn.timestamp;
  const newItem: OutbreakHistoryItem = {
    outbreakId: `${locationId}-${checkInTimestamp}`,
    isExpired: false,
    isIgnored: false,
    locationId,
    locationAddress: matchData.checkIn.address,
    locationName: matchData.checkIn.name,
    outbreakStartTimestamp: Number(matchData.outbreakEvent.startTime),
    outbreakEndTimestamp: Number(matchData.outbreakEvent.endTime),
    checkInTimestamp,
    notificationTimestamp: getCurrentDate().getTime() /* revisit */,
    severity: matchData.outbreakEvent.severity,
  };
  return newItem;
};

export const getNewOutbreakExposures = (
  detectedExposures: OutbreakHistoryItem[],
  outbreakHistory: OutbreakHistoryItem[],
): OutbreakHistoryItem[] => {
  const detectedIds = detectedExposures.map(item => item.outbreakId);
  const oldIds = outbreakHistory.map(item => item.outbreakId);
  // are there any Ids in detectedIds that are new?
  const newIds = detectedIds.filter(id => oldIds.indexOf(id) === -1);
  const newOutbreakExposures = detectedExposures.filter(item => newIds.indexOf(item.outbreakId) > -1);
  return newOutbreakExposures;
};

interface MaxEndTimeDict {
  [key: string]: number;
}

export const getMatchTimestampDict = (allMatches: MatchData[]) => {
  const maxEndDateDict: MaxEndTimeDict = {};
  for (let i = 0; i < allMatches.length; i++) {
    const match = allMatches[i];
    const timestampStr = match.timestamp.toString();
    if (Object.keys(maxEndDateDict).indexOf(timestampStr) === -1) {
      maxEndDateDict[timestampStr] = match.outbreakEvent.endTime;
      continue;
    }
    if (maxEndDateDict[timestampStr] < match.outbreakEvent.endTime) {
      maxEndDateDict[timestampStr] = match.outbreakEvent.endTime;
    }
  }
  return maxEndDateDict;
};

export const filterDuplicateMatches = (match: MatchData, maxEndDateDict: MaxEndTimeDict) => {
  const timestampStr = match.timestamp.toString();
  if (Object.keys(maxEndDateDict).indexOf(timestampStr) === -1) {
    throw Error(`you built the maxEndDateDict wrong, it is missing timestamp: ${timestampStr}`);
  }
  if (maxEndDateDict[timestampStr] === match.outbreakEvent.endTime) {
    return true;
  }
  return false;
};
