import {ExposureNotification, ExposureSummary} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(
  exposureNotificationAPI: ExposureNotification,
): ExposureNotification {
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
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        summaries.push(summary);
      }
      captureMessage('configuration', {configuration});
      captureMessage('diagnosisKeysURLs', {diagnosisKeysURLs});
      captureMessage('summaries', {summaries});
      return summaries;
    },
    getPendingExposureSummary: async () => {
      const summary = await exposureNotificationAPI.getPendingExposureSummary();
      if (summary) {
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
      }
      return [summary];
    },
  };
}
