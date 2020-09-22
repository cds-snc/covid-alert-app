import {addDays, getCurrentDate} from '../../shared/date-fns';

import {getLastExposureTimestamp} from './utils';

jest.mock('../../shared/date-fns', () => ({
  ...jest.requireActual('../../shared/date-fns'),
  getCurrentDate: () => {
    return new Date(2020, 1, 1);
  },
}));

// these are real summaries pulled from loggly
// I set lastExposureTimestamp = undefined since that is not
// calculated yet when getLastExposureTimestamp is called
const androidExposureSummary = {
  lastExposureTimestamp: 0,
  matchedKeyCount: 2,
  maximumRiskScore: 5,
  daysSinceLastExposure: 0,
  attenuationDurations: [17, 0, 0],
};

const iosExposureSummary = {
  lastExposureTimestamp: 0,
  matchedKeyCount: 2,
  maximumRiskScore: 4,
  daysSinceLastExposure: 2,
  attenuationDurations: [1260, 480, 0],
};

const noExposureSummary = {
  matchedKeyCount: 0,
  maximumRiskScore: 0,
  lastExposureTimestamp: 0,
  daysSinceLastExposure: 2147483647,
  attenuationDurations: [0, 0, 0],
};

describe('utils', () => {
  describe('getLastExposureTimestamp', () => {
    it('returns undefined if summary does not contain a matched key', () => {
      // this requirement if from apple: https://developer.apple.com/documentation/exposurenotification/enexposuredetectionsummary/3583708-dayssincelastexposure
      // it will change in V2
      expect(getLastExposureTimestamp(noExposureSummary)).toStrictEqual(0);
    });
    it('returns x for a summary w/ an exposure that happened x days ago', () => {
      const today = getCurrentDate();
      expect(getLastExposureTimestamp(androidExposureSummary)).toStrictEqual(today.getTime());
      expect(getLastExposureTimestamp(iosExposureSummary)).toStrictEqual(addDays(today, -2).getTime());
    });
  });
});
