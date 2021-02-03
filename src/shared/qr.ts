import {OUTBREAK_LOCATIONS_URL} from 'env';
import {log} from 'shared/logging/config';

export interface CheckInData {
  id: string;
  name: string;
  timestamp: number;
}

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
  if (matches.length > 0) {
    return true;
  }
  return false;
};
