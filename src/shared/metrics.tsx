import {log} from 'shared/logging/config';
import {
  useExposureStatus,
  ExposureStatusType,
  ExposureStatus,
  SystemStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';

const checkStatus = (exposureStatus: ExposureStatus): {exposed: boolean} => {
  if (exposureStatus.type === ExposureStatusType.Exposed) {
    return {exposed: true};
  }

  return {exposed: false};
};

export type EventType = 'installed' | 'onboarded' | 'exposed' | 'otk-no-date' | 'otk-with-date' | 'en-toggle';

export const sendMetricEvent = (payload: any) => {
  log.debug({message: 'metric', payload});
};

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();

  const addEvent = (eventType: EventType) => {
    let payload: any = {identifier: eventType, timestamp: new Date().getTime(), region};

    switch (eventType) {
      case 'installed':
        break;
      case 'onboarded':
        payload = {
          ...payload,
          pushnotification: notificationStatus,
          frameworkenabled: systemStatus === SystemStatus.Active,
        };
        break;
      case 'exposed':
        break;
      case 'otk-no-date':
        payload = {...checkStatus(exposureStatus), ...payload};
        break;
      case 'otk-with-date':
        payload = {...checkStatus(exposureStatus), ...payload};
        break;
      case 'en-toggle':
        payload = userStopped ? {...payload, state: 'off'} : {...payload, state: 'on'};
        break;
    }

    sendMetricEvent(payload);
  };

  return addEvent;
};
