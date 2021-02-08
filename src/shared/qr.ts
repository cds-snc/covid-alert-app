// import AsyncStorage from '@react-native-community/async-storage';
import {OUTBREAK_LOCATIONS_URL} from 'env';
// import {Key} from 'services/StorageService';
import {log} from 'shared/logging/config';

import {getCurrentDate} from './date-fns';

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

export interface ExposedLocationData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
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
  outbreakData: ExposedLocationData[];
  checkInData: CheckInData[];
  matchCount?: number;
  matchedCheckIns?: CheckInData[];
  mostRecentCheckOut?: number;
}

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const initialOutbreakStatus = {type: OutbreakStatusType.Monitoring, lastChecked: 0};

export const getOutbreakLocations = async (): Promise<ExposedLocationData[]> => {
  const fetchedData = await fetch(OUTBREAK_LOCATIONS_URL, {
    method: 'GET',
  });
  const data = await fetchedData.json();
  return data.exposedLocations;
};

export const getNewOutbreakStatus = async (checkInHistory: CheckInData[]): Promise<OutbreakStatus> => {
  const outbreakLocations = await getOutbreakLocations();

  log.debug({message: 'fetching outbreak locations', payload: {outbreakLocations}});
  const outbreakIds = outbreakLocations.map(location => location.id);

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

  const matches = getMatches({checkInHistory, outbreakLocations, matchedOutbreakIds});

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
  outbreakLocations,
  checkInHistory,
  matchedOutbreakIds,
}: {
  outbreakLocations: ExposedLocationData[];
  checkInHistory: CheckInData[];
  matchedOutbreakIds: string[];
}): MatchData[] => {
  const relevantOutbreakData = outbreakLocations.filter(location => matchedOutbreakIds.indexOf(location.id) > -1);
  const relevantCheckInData = checkInHistory.filter(data => matchedOutbreakIds.indexOf(data.id) > -1);

  const _matchData = matchedOutbreakIds.map(id => {
    return {
      id,
      outbreakData: relevantOutbreakData.filter(data => data.id === id),
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
    for (const outbreak of matchData.outbreakData) {
      const window1: TimeWindow = {
        start: checkIn.timestamp,
        end: checkIn.timestamp + ONE_HOUR_IN_MS,
      };
      const window2: TimeWindow = {
        start: new Date(outbreak.startTime).getTime(),
        end: new Date(outbreak.endTime).getTime(),
      };
      if (doTimeWindowsOverlap(window1, window2)) {
        matchCount += 1;
        matchedCheckIns.push(checkIn);
      }
    }
  }
  return {...matchData, matchCount, matchedCheckIns};
};
