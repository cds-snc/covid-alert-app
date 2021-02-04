import AsyncStorage from '@react-native-community/async-storage';
import {OUTBREAK_LOCATIONS_URL} from 'env';
import {Key} from 'services/StorageService';
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

export interface OutbreakStatus {
  type: OutbreakStatusType;
  lastChecked: number;
}

export const initialOutbreakStatus = {type: OutbreakStatusType.Monitoring, lastChecked: 0};

export const getOutbreakLocations = async () => {
  const fetchedData = await fetch(OUTBREAK_LOCATIONS_URL, {
    method: 'GET',
  });
  return fetchedData.json();
};

export const checkForOutbreakExposures = async (checkInHistory: CheckInData[]) => {
  const outbreakLocations = await getOutbreakLocations();
  log.debug({message: 'fetching outbreak locations', payload: {outbreakLocations}});
  const outbreakIds = await outbreakLocations.exposedLocations.map((location: any) => location.id);
  const matches = checkInHistory.filter(checkIn => {
    if (outbreakIds.indexOf(checkIn.id) > -1) {
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
  log.debug({message: 'checkForOutbreakExposures', payload: {newOutbreakStatus}});
  AsyncStorage.setItem(Key.OutbreakStatus, JSON.stringify(newOutbreakStatus));
};
