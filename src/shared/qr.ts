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
  startDate: string;
  endDate: string;
}
export interface OutbreakStatus {
  type: OutbreakStatusType;
  lastChecked: number;
}

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

  const matches = checkInLocationMatches.filter(checkIn => {
    const checkInTime = new Date(checkIn.timestamp);
    const timeAndLocationMatches = outbreakLocations
      .filter(location => location.id === checkIn.id)
      .filter(location => checkInTime > new Date(location.startDate) && checkInTime < new Date(location.endDate));
    if (timeAndLocationMatches.length > 0) {
      return true;
    }
    return false;
  });

  log.debug({message: 'outbreak location matches', payload: {matches}});

  const newOutbreakStatusType = matches.length > 0 ? OutbreakStatusType.Exposed : OutbreakStatusType.Monitoring;

  const newOutbreakStatus = {
    type: newOutbreakStatusType,
    lastChecked: getCurrentDate().getTime(),
  };
  log.debug({message: 'getNewOutbreakStatus', payload: {newOutbreakStatus}});
  return newOutbreakStatus;
};
