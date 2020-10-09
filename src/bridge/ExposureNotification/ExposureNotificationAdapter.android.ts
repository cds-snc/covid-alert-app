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
    provideDiagnosisKeys: async (diagnosisKeysURLs: string[]) => {
      if (diagnosisKeysURLs.length === 0) {
        throw new Error('Attempt to call provideDiagnosisKeys with empty list of downloaded files');
      }
      const mock = async (keys: any) => keys;
      for (const diagnosisKeysURL of diagnosisKeysURLs) {
        // todo: replace mock with exposureNotificationAPI.provideDiagnosisKeys
        await mock([diagnosisKeysURL]);
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
