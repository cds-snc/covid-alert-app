import {captureMessage} from 'shared/log';

import {ExposureConfiguration, ExposureNotificationAPI, ExposureSummary} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(exposureNotificationAPI: ExposureNotificationAPI) {
  return {
    ...exposureNotificationAPI,
    detectExposure: async (configuration: ExposureConfiguration, diagnosisKeysURLs: string[]) => {
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
      captureMessage('ExposureNotificationAdapter.android - detectExposure summaries', {summaries});
      return summaries;
    },
    getPendingExposureSummary: async () => {
      const summary = await exposureNotificationAPI.getPendingExposureSummary();

      captureMessage('ExposureNotificationAdapter.android - getPendingExposureSummary', {summary});
      if (summary) {
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        return [summary];
      }
      return [];
    },
    getExposureWindowsCustom: async (configuration: ExposureConfiguration, diagnosisKeysURLs: string[]) => {
      console.log('getExposureWindowsCustom')
      await exposureNotificationAPI.provideDiagnosisKeys(diagnosisKeysURLs);
      console.log('position 2')
      const exposureWindows = await exposureNotificationAPI.getExposureWindows();
      return exposureWindows;
    },
  };
}
