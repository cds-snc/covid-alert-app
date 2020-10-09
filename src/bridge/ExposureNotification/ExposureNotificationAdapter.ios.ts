import {unzip} from 'react-native-zip-archive';
import {captureMessage} from 'shared/log';

import {
  CalibrationConfidence,
  ExposureConfiguration,
  ExposureNotificationAPI,
  ExposureSummary,
  ExposureWindow,
  Infectiousness,
  Report,
  ScanInstance,
} from './types';
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
    provideDiagnosisKeys: async (diagnosisKeysURLs: string[]) => {
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call provideDiagnosisKeys with empty list of downloaded files');
      }
      captureMessage('diagnosisKeysURLs.length', {length: diagnosisKeysURLs.length});

      for (const keysZipUrl of diagnosisKeysURLs) {
        const components = keysZipUrl.split('/');
        components.pop();
        components.push('keys-export');
        const targetDir = components.join('/');
        const unzippedLocation = await unzip(keysZipUrl, targetDir);
        const mock = async (keys: any) => keys;
        // todo: change mock to exposureNotificationAPI.provideDiagnosisKeys when the native
        // layer is implemented
        await mock([`${unzippedLocation}/export.bin`, `${unzippedLocation}/export.sig`]);
      }
    },
    getExposureWindows: async () => {
      // todo: replace mock with exposureNotificationAPI.getExposureWindows
      const scanInstance: ScanInstance = {
        typicalAttenuation: 60,
        minAttenuation: 80,
        secondsSinceLastScan: 120,
      };
      const exposureWindow: ExposureWindow = {
        day: 0,
        scanInstances: [scanInstance, scanInstance],
        reportType: Report.ConfirmedClinicalDiagnosis,
        infectiousness: Infectiousness.Standard,
        calibrationConfidence: CalibrationConfidence.Medium,
      };
      return exposureWindow;
    },
  };
}
