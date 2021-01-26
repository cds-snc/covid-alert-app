import {log} from 'shared/logging/config';
import {captureMessage} from 'shared/log';

import {
  CalibrationConfidence,
  ExposureConfiguration,
  ExposureNotificationAPI,
  ExposureSummary,
  Infectiousness,
  ReportType,
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
      log.debug({
        category: 'configuration',
        payload: configuration,
      });

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
    getExposureWindowsAndroid: async (diagnosisKeysURLs: string[]) => {
      try {
        await exposureNotificationAPI.provideDiagnosisKeys(diagnosisKeysURLs);
      } catch (error) {
        log.error({message: 'exposureNotificationAPI.provideDiagnosisKeys failed', error});
      }
      try {
        const _exposureWindows = await exposureNotificationAPI.getExposureWindows();
        const exposureWindows = _exposureWindows.map(window => {
          window.day = Number(window.day);
          window.calibrationConfidence = window.calibrationConfidence as CalibrationConfidence;
          window.infectiousness = window.infectiousness as Infectiousness;
          window.reportType = window.reportType as ReportType;
          return window;
        });
        log.debug({
          category: 'exposure-check',
          message: 'exposureWindows',
          payload: {'exposureWindows.length': exposureWindows.length, exposureWindows},
        });
        return exposureWindows;
      } catch (error) {
        log.error({message: 'exposureNotificationAPI.getExposureWindows failed', error});
      }
    },
    setDiagnosisKeysDataMapping: async () => {
      try {
        await exposureNotificationAPI.setDiagnosisKeysDataMapping();
      } catch (error) {
        log.error({message: 'exposureNotificationAPI.setDiagnosisKeysDataMapping failed', error});
      }
      log.debug({message: 'setDiagnosisKeysDataMapping successful'});
    },
  };
}
