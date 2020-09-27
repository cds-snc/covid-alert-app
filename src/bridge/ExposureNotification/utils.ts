import {addDays, getCurrentDate} from 'shared/date-fns';

import {ExposureSummary} from './types';

/**
 * TODO: remove in follow up PR https://github.com/cds-snc/covid-shield-mobile/issues/803
 */
export function getLastExposureTimestamp(summary: ExposureSummary) {
  if (summary.matchedKeyCount < 1) {
    return 0;
  }
  const today = getCurrentDate();
  const lastExposureTimestamp = addDays(today, -summary.daysSinceLastExposure).getTime();
  return lastExposureTimestamp;
}
