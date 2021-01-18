/* eslint-disable @typescript-eslint/prefer-for-of */
import {log} from 'shared/logging/config';
import {unzip} from 'react-native-zip-archive';
import {captureMessage} from 'shared/log';

import {ExposureConfiguration, ExposureNotificationAPI, ExposureSummary, ExposureWindow} from './types';
import {getLastExposureTimestamp} from './utils';

const asyncForEach = async (array: any[], callback: (arg: any) => Promise<any>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
};

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

      const getBinAndSigUrls = async (keysZipUrl: string) => {
        const components = keysZipUrl.split('/');
        components.pop();
        components.push('keys-export');
        const targetDir = components.join('/');
        const unzippedLocation = await unzip(keysZipUrl, targetDir);
        return [`${unzippedLocation}/export.bin`, `${unzippedLocation}/export.sig`];
      };

      let allBinAndSigUrls: string[] = [];
      await asyncForEach(diagnosisKeysURLs, async (keyZipUrl: string) => {
        const binAndSigUrls = await getBinAndSigUrls(keyZipUrl);
        allBinAndSigUrls = allBinAndSigUrls.concat(binAndSigUrls);
      });
      log.debug({
        category: 'exposure-check',
        message: 'exposureNotificationAPI.detectExposure',
        payload: {allBinAndSigUrls},
      });
      const exposureWindows: ExposureWindow[] = await exposureNotificationAPI.detectExposureV2(
        configuration,
        allBinAndSigUrls,
      );
      log.debug({
        category: 'configuration',
        payload: configuration,
      });
      return exposureWindows;
    },
  };
}
