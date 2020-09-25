import {captureMessage} from 'shared/log';

import {ExposureNotification, ExposureSummary} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(exposureNotificationAPI: any): ExposureNotification {
  return {
    ...exposureNotificationAPI,
    detectExposure: async (configuration, diagnosisKeysURLs) => {
      const summaries: ExposureSummary[] = [];
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call detectExposure with empty list of downloaded files');
      }
      for (const diagnosisKeysURL of diagnosisKeysURLs) {
        const summary: ExposureSummary = await exposureNotificationAPI.detectExposure(configuration, [
          diagnosisKeysURL,
        ]);

        captureMessage('ExposureNotificationAdapter.Android - detectExposure', {summary});

        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        // first detected exposure is enough
        if (summary.matchedKeyCount > 0) {
          summaries.push(summary);
        }
      }
      return summaries!;
    },
    getPendingExposureSummary: async () => {
      const summaries: ExposureSummary[] = [];
      const summary = await exposureNotificationAPI.getPendingExposureSummary();
      captureMessage('ExposureNotificationAdapter.Android - getPendingExposureSummary', {summary});
      if (summary) {
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        summaries.push(summary);
      }
      return summaries;
    },
  };
}
