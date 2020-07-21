import {ExposureNotification} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(exposureNotificationAPI: any): ExposureNotification {
  return {
    ...exposureNotificationAPI,
    getExposureInformation: summary => {
      return exposureNotificationAPI.getExposureInformation(summary);
    },
    detectExposure: async (configuration, diagnosisKeysURLs) => {
      return new Promise((resolve, reject) => {
        if (diagnosisKeysURLs.length === 0) {
          reject(new Error('Attempt to call detectExposure with empty list of downloaded files'));
          return;
        }
        for (const diagnosisKeysURL of diagnosisKeysURLs) {
          (async (diagnosisKeysURL: string) => {
            const summary = await exposureNotificationAPI.detectExposure(configuration, [diagnosisKeysURL]);
            summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
            // first detected exposure is enough
            if (summary.matchedKeyCount > 0) {
              resolve(summary);
            }
          })(diagnosisKeysURL);
        }
      });
    },
    getPendingExposureSummary: async () => {
      const summary = await exposureNotificationAPI.getPendingExposureSummary();
      summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
      return summary;
    },
  };
}
