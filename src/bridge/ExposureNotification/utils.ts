import {addDays, getCurrentDate} from 'shared/date-fns';

import {ExposureSummary} from './types';

/**
 * TODO: remove in follow up PR https://github.com/cds-snc/covid-shield-mobile/issues/803
 */
export function getLastExposureTimestamp(summary: ExposureSummary) {
  const today = getCurrentDate();
  const lastExposureTimestamp =
    summary.matchedKeyCount > 0 ? addDays(today, -summary.daysSinceLastExposure).getTime() : 0;
  return lastExposureTimestamp;
}
