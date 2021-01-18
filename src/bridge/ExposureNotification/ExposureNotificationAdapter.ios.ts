import {log} from 'shared/logging/config';
import {unzip} from 'react-native-zip-archive';
import {captureMessage} from 'shared/log';

import {ExposureConfiguration, ExposureNotificationAPI, ExposureSummary, ExposureWindow} from './types';
import {getLastExposureTimestamp} from './utils';

export default function ExposureNotificationAdapter(exposureNotificationAPI: ExposureNotificationAPI) {
  return {
    ...exposureNotificationAPI,
    detectExposure: async (configuration: ExposureConfiguration, diagnosisKeysURLs: string[]) => {
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

        captureMessage('ExposureNotificationAdapter.iOS - detectExposure', {summary});

        summary.lastExposureTimestamp = getLastExposureTimestamp(summary);
        summaries.push(summary);
      }
      log.debug({
        category: 'configuration',
        payload: configuration,
      });

      captureMessage('summaries', {summaries});
      return summaries;
    },
    getPendingExposureSummary: async () => undefined,
    detectExposureV2: async (configuration: ExposureConfiguration, diagnosisKeysURLs: string[]) => {
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

        const exposureWindows: ExposureWindow[] = await exposureNotificationAPI.detectExposureV2(configuration, [
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

      const delay = (delayTimeMs: number) => new Promise(resolve => setTimeout(resolve, delayTimeMs));

      const forLoop = async () => {
        const i = 0;
        const results: ExposureWindow[] = [];
        for (const keyZipUrl of diagnosisKeysURLs.reverse()) {
          const exposureWindows = await mapKeysToExposureWindows(keyZipUrl);
          results.concat(exposureWindows);
          if (i === diagnosisKeysURLs.length - 1) {
            return results;
          }
          console.log('start pause');
          await delay(20000);
          console.log('done pause');
        }
      };
      // the following only works if we use one element from diagnosisKeysURLs
      const exposureWindowArray = Promise.all(diagnosisKeysURLs.reverse().slice(1).map(mapKeysToExposureWindows));
      const allExposureWindows = exposureWindowArray.then(arrays => {
        // https://stackoverflow.com/questions/42173350/synchronous-and-asynchronous-loops-in-javascript
        // eslint-disable-next-line prefer-spread
        return [].concat.apply([], arrays);
      });
      // const allExposureWindows = await forLoop();
      log.debug({
        category: 'configuration',
        payload: configuration,
      });

      return allExposureWindows;
    },
  };
}
