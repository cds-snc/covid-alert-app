import {log} from 'shared/logging/config';
import {unzip} from 'react-native-zip-archive';

import {ExposureConfiguration, ExposureNotificationAPI, ExposureSummary, ExposureWindow} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(exposureNotificationAPI: ExposureNotificationAPI) {
  return {
    ...exposureNotificationAPI,
    detectExposure: async (configuration: ExposureConfiguration, diagnosisKeysURLs: string[]) => {
      const allExposureWindows: ExposureWindow[] = [];
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call detectExposure with empty list of downloaded files');
      }
      log.debug({
        category: 'exposure-check',
        message: 'exposureNotificationAPI.detectExposure before for loop',
        payload: {diagnosisKeysURLs},
      });
      for (const keysZipUrl of diagnosisKeysURLs) {
        log.debug({
          category: 'exposure-check',
          message: 'exposureNotificationAPI.detectExposure start of for loop',
          payload: {keysZipUrl},
        });
        const components = keysZipUrl.split('/');
        components.pop();
        components.push('keys-export');
        const targetDir = components.join('/');
        const unzippedLocation = await unzip(keysZipUrl, targetDir);
        // hard-coding this temporarily - v2 takes 3 values
        configuration.attenuationDurationThresholds = [50, 62, 90];

        const exposureWindows: ExposureWindow[] = await exposureNotificationAPI.detectExposure(configuration, [
          `${unzippedLocation}/export.bin`,
          `${unzippedLocation}/export.sig`,
        ]);

        log.debug({
          category: 'exposure-check',
          message: 'exposureNotificationAPI.detectExposure',
          payload: {'exposureWindows.length': exposureWindows.length},
        });
        // this call will fail on V2 since `daysSinceLastExposure` does not exist on summary
        // summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        allExposureWindows.concat(exposureWindows);
      }

      log.debug({
        category: 'configuration',
        payload: configuration,
      });

      return allExposureWindows;
    },
    getPendingExposureSummary: async () => undefined,
    getExposureWindowsIos: async (summary: ExposureSummary) => {
      return exposureNotificationAPI.getExposureWindowsFromSummary(summary);
    },
  };
}
