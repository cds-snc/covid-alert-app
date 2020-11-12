import {unzip} from 'react-native-zip-archive';
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
      captureMessage('diagnosisKeysURLs.length', {length: diagnosisKeysURLs.length});
      configuration.infectiousnessForDaysSinceOnsetOfSymptoms = {0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1};
      for (const keysZipUrl of diagnosisKeysURLs) {
        const components = keysZipUrl.split('/');
        components.pop();
        components.push('keys-export');
        const targetDir = components.join('/');
        const unzippedLocation = await unzip(keysZipUrl, targetDir);
        const summary: ExposureSummary = await exposureNotificationAPI.detectExposure(configuration, [
          `${unzippedLocation}/export.bin`,
          `${unzippedLocation}/export.sig`,
        ]);

        captureMessage('ExposureNotificationAdapter.iOS - detectExposure', {summary});

        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        summaries.push(summary);
      }
      captureMessage('configuration', {configuration});
      captureMessage('diagnosisKeysURLs', {diagnosisKeysURLs});
      captureMessage('summaries', {summaries});
      return summaries;
    },
    getPendingExposureSummary: async () => undefined,
    getExposureWindowsIos: async (summary: ExposureSummary) => {
      return exposureNotificationAPI.getExposureWindowsFromSummary(summary);
    },
  };
}
