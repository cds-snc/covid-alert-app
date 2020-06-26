import {unzip} from 'react-native-zip-archive';

import {ExposureNotification, ExposureConfiguration, ExposureSummary} from './ExposureNotificationAPI';

export default function ExposureNotificationAdapter(
  exposureNotificationAPI: ExposureNotification,
): ExposureNotification {
  return {
    ...exposureNotificationAPI,
    detectExposure: async (
      configuration: ExposureConfiguration,
      diagnosisKeysURLs: string[],
    ): Promise<ExposureSummary> => {
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call detectExposure with empty list of downloaded files');
      }
      let summary: ExposureSummary;
      for (const keysZipUrl of diagnosisKeysURLs) {
        const components = keysZipUrl.split('/');
        components.pop();
        components.push('keys-export');
        const targetDir = components.join('/');

        const unzippedLocation = await unzip(keysZipUrl, targetDir);
        summary = await exposureNotificationAPI.detectExposure(configuration, [
          `${unzippedLocation}/export.bin`,
          `${unzippedLocation}/export.sig`,
        ]);
        // first detected exposure is enough
        if (summary.matchedKeyCount > 0) break;
      }
      return summary!;
    },
  };
}
