import {ExposureNotification, ExposureSummary} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(exposureNotificationAPI: any): ExposureNotification {
  return {
    ...exposureNotificationAPI,
    getExposureInformation: summary => {
      return exposureNotificationAPI.getExposureInformation(summary);
    },
    detectExposure: async (configuration, diagnosisKeysURLs) => {
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call detectExposure with empty list of downloaded files');
      }
      let summary: ExposureSummary;
      for (const diagnosisKeysURL of diagnosisKeysURLs) {
        summary = await exposureNotificationAPI.detectExposure(configuration, [diagnosisKeysURL]);
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        // first detected exposure is enough
        if (summary.matchedKeyCount > 0) break;
      }
      return summary!;
    },
    getPendingExposureSummary: async () => {
      const summary = await exposureNotificationAPI.getPendingExposureSummary();
      if (summary) {
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
      }
      return summary;
    },
  };
}
