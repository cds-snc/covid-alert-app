// import AsyncStorage from '@react-native-community/async-storage';
import {OUTBREAK_LOCATIONS_URL} from 'env';
// import {Key} from 'services/StorageService';
import {log} from 'shared/logging/config';

import {getCurrentDate} from './date-fns';

export interface CheckInData {
  id: string;
  name: string;
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

interface TimeWindow {
  start: number;
  end: number;
}

interface Data {
  id: string;
  outbreakData: ExposedLocationData[];
  checkInData: CheckInData[];
  matchCount: number;
  matchedCheckIns: CheckInData[];
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
  const relevantOutbreakIds = checkInLocationMatches.map(data => data.id);
  const uniqueRelevantOutbreakIds = Array.from(new Set(relevantOutbreakIds));
  const relevantOutbreakData = outbreakLocations.filter(
    location => uniqueRelevantOutbreakIds.indexOf(location.id) > -1,
  );
  const relevantCheckInData = checkInHistory.filter(data => uniqueRelevantOutbreakIds.indexOf(data.id) > -1);

  const calcData: Data[] = uniqueRelevantOutbreakIds.map(id => {
    return {
      id,
      outbreakData: relevantOutbreakData.filter(data => data.id === id),
      checkInData: relevantCheckInData.filter(data => data.id === id),
      matchCount: 0,
      matchedCheckIns: [],
    };
  });

  calcData.forEach(data => {
    for (const checkIn of data.checkInData) {
      for (const outbreak of data.outbreakData) {
        const window1: TimeWindow = {
          start: checkIn.timestamp,
          end: checkIn.timestamp + ONE_HOUR_IN_MS,
        };
        const window2: TimeWindow = {
          start: new Date(outbreak.startTime).getTime(),
          end: new Date(outbreak.endTime).getTime(),
        };
        if (doTimeWindowsOverlap(window1, window2)) {
          data.matchCount += 1;
          data.matchedCheckIns.push(checkIn);
        }
      }
    }
  });
  const matches = calcData.filter(data => data.matchCount > 0);

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
  return false;
};
