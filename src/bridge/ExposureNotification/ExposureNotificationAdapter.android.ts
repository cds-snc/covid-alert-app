import {ExposureNotification, ExposureSummary, ExposureInformation} from './types';

export default function ExposureNotificationAdapter(exposureNotificationAPI: any): ExposureNotification {
  return {
    ...exposureNotificationAPI,
    getExposureInformation: (
      summary: ExposureSummary,
      _: string /* ignored on android */,
    ): Promise<ExposureInformation[]> => {
      return exposureNotificationAPI.getExposureInformation(summary);
    },
  };
}
