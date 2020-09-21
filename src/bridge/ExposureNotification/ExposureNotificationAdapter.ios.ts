import {unzip} from 'react-native-zip-archive';

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
        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        if (summary.matchedKeyCount > 0) {
          summaries.push(summary);
        };
      }
      return summaries!;
    },
    getPendingExposureSummary: async () => undefined,
  };
}
