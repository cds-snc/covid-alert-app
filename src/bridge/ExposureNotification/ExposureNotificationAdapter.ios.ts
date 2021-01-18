import {log} from 'shared/logging/config';
import {unzip} from 'react-native-zip-archive';

import {ExposureConfiguration, ExposureNotificationAPI, ExposureSummary, ExposureWindow} from './types';

export default function ExposureNotificationAdapter(exposureNotificationAPI: ExposureNotificationAPI) {
  return {
    ...exposureNotificationAPI,
    detectExposure: async (configuration: ExposureConfiguration, diagnosisKeysURLs: string[]) => {
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call detectExposure with empty list of downloaded files');
      }
      const mapKeysToExposureWindows = async (keysZipUrl: string) => {
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
        return exposureWindows;
      };

      log.debug({
        category: 'exposure-check',
        message: 'exposureNotificationAPI.detectExposure before for loop',
        payload: {diagnosisKeysURLs},
      });
      const exposureWindowArray = Promise.all(diagnosisKeysURLs.map(mapKeysToExposureWindows));
      const allExposureWindows = exposureWindowArray.then(arrays => {
        // https://stackoverflow.com/questions/42173350/synchronous-and-asynchronous-loops-in-javascript
        // eslint-disable-next-line prefer-spread
        return [].concat.apply([], arrays);
      });

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
