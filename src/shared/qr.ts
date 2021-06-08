import {ProximityExposureHistoryItem} from 'services/ExposureNotificationService';
import {OutbreakEvent} from 'services/OutbreakService';
import {log} from 'shared/logging/config';

import {getCurrentDate, getHoursBetween} from './date-fns';

export const OUTBREAK_EXPOSURE_DURATION_DAYS = 14;

export enum OutbreakSeverity {
  SelfIsolate = 1,
  SelfMonitor = 2,
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

export interface MatchData {
  timestamp: number;
  checkIn: CheckInData;
  outbreakEvent: OutbreakEvent;
}

interface MatchDeduplicationDict {
  [checkInTimestamp: string]: {
    outbreakEventId: string;
    maxOutbreakEndTimestamp: number;
    maxSeverity: OutbreakSeverity;
  };
}

export interface OutbreakHistoryItem {
  id: string /* unique to your checkin during the outbreak event */;
  isExpired: boolean /* after 14 days the outbreak expires */;
  isIgnored: boolean /* if user has a negative test result */;
  isIgnoredFromHistory: boolean /* if user deletes from history page */;
  locationId: string;
  locationAddress: string;
  locationName: string;
  outbreakStartTimestamp: number;
  outbreakEndTimestamp: number;
  checkInTimestamp: number;
  notificationTimestamp: number;
  severity: OutbreakSeverity;
}

export type CombinedExposureHistoryData =
  | {
      notificationTimestamp: number;
      exposureType: ExposureType.Outbreak;
      subtitle: string;
      historyItem: OutbreakHistoryItem;
    }
  | {
      notificationTimestamp: number;
      exposureType: ExposureType.Proximity;
      subtitle: string;
      historyItem: ProximityExposureHistoryItem;
    };

/** returns a new outbreakHistory with the `isExpired` property updated */
export const expireHistoryItems = (outbreakHistory: OutbreakHistoryItem[]): OutbreakHistoryItem[] => {
  return outbreakHistory.map(historyItem => {
    if (historyItem.isExpired) {
      return {...historyItem};
    }
    const currentDate = getCurrentDate();

    const hoursSinceCheckIn = getHoursBetween(new Date(historyItem.checkInTimestamp), currentDate);

    if (hoursSinceCheckIn > 24 * OUTBREAK_EXPOSURE_DURATION_DAYS) {
      return {...historyItem, isExpired: true};
    }

    return {...historyItem};
  });
};

export const getNonIgnoredOutbreakHistory = (outbreakHistory: OutbreakHistoryItem[]) => {
  return outbreakHistory.filter(outbreak => {
    if (outbreak.isExpired || outbreak.isIgnored) {
      return false;
    }
    return true;
  });
};

export const getNonIgnoredFromHistoryOutbreakHistory = (outbreakHistory: OutbreakHistoryItem[]) => {
  return outbreakHistory.filter(outbreak => {
    if (outbreak.isExpired || outbreak.isIgnoredFromHistory) {
      return false;
    }
    return true;
  });
};

export const isExposedToOutbreak = (outbreakHistory: OutbreakHistoryItem[]) => {
  const currentOutbreakHistory = getNonIgnoredOutbreakHistory(outbreakHistory);

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

  log.debug({category: 'qr-code', message: 'outbreak matches', payload: {allMatches}});

  const deduplicatedMatches = deduplicateMatches(allMatches);
  return deduplicatedMatches.map(match => createOutbreakHistoryItem(match));
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
    id: `${locationId}-${checkInTimestamp}`,
    isExpired: false,
    isIgnored: false,
    isIgnoredFromHistory: false,
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
  const detectedIds = detectedExposures.map(item => item.id);
  const oldIds = outbreakHistory.map(item => item.id);
  // are there any Ids in detectedIds that are new?
  const newIds = detectedIds.filter(id => oldIds.indexOf(id) === -1);
  const newOutbreakExposures = detectedExposures.filter(item => newIds.indexOf(item.id) > -1);
  return newOutbreakExposures;
};

const isKeyInObject = (key: string, object: object) => {
  return Object.keys(object).indexOf(key) === -1;
};

const isSeverityHigher = (match: MatchData, deduplicationDict: MatchDeduplicationDict) => {
  const timestampStr = match.timestamp.toString();
  return deduplicationDict[timestampStr].maxSeverity < match.outbreakEvent.severity;
};

/**
 * Look at all outbreak/checkin matches and remove duplicate matches
 * so the same checkin never results in more than one exposure
 */
export const deduplicateMatches = (allMatches: MatchData[]) => {
  const deduplicationDict: MatchDeduplicationDict = {};
  for (const match of allMatches) {
    const timestampStr = match.timestamp.toString();
    if (isKeyInObject(timestampStr, deduplicationDict) || isSeverityHigher(match, deduplicationDict)) {
      deduplicationDict[timestampStr] = {
        maxOutbreakEndTimestamp: match.outbreakEvent.endTime,
        maxSeverity: match.outbreakEvent.severity,
        outbreakEventId: match.outbreakEvent.dedupeId,
      };
    }
  }
  const validOutbreakEventIds = Object.values(deduplicationDict).map(item => item.outbreakEventId);
  const deduplicatedMatches = allMatches.filter(
    match => validOutbreakEventIds.indexOf(match.outbreakEvent.dedupeId) > -1,
  );
  return deduplicatedMatches;
};
