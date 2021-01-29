import {log} from 'shared/logging/config';
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
        log.error({category: 'exposure-check', message: 'exposureNotificationAPI.provideDiagnosisKeys failed', error});
        // no-op
      }
      try {
        const _exposureWindows = await exposureNotificationAPI.getExposureWindows();
        const exposureWindows = _exposureWindows.map(window => {
          return {...window, day: Number(window.day)};
        });
        log.debug({
          category: 'exposure-check',
          message: 'exposureWindows',
          payload: {'exposureWindows.length': exposureWindows.length, exposureWindows},
        });
        return exposureWindows;
      } catch (error) {
        log.error({category: 'exposure-check', message: 'exposureNotificationAPI.getExposureWindows failed', error});
        // no-op
      }
      return [];
    },
    setDiagnosisKeysDataMapping: async () => {
      try {
        await exposureNotificationAPI.setDiagnosisKeysDataMapping();
      } catch (error) {
        log.error({
          category: 'exposure-check',
          message: 'exposureNotificationAPI.setDiagnosisKeysDataMapping failed',
          error,
        });
        // no-op
      }
      log.debug({category: 'exposure-check', message: 'setDiagnosisKeysDataMapping successful'});
    },
  };
}
