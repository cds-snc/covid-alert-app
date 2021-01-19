import {log} from 'shared/logging/config';
import {
  useExposureStatus,
  ExposureStatusType,
  ExposureStatus,
  SystemStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useNotificationPermissionStatus} from '../../src/screens/home/components/NotificationPermissionStatus';

const checkStatus = (exposureStatus: ExposureStatus): {exposed: boolean} => {
  if (exposureStatus.type === ExposureStatusType.Exposed) {
    return {exposed: true};
  }

  return {exposed: false};
};

type EventType = 'installed' | 'onboarded' | 'exposed' | 'onetimekey' | 'en-toggle';

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
      case 'onetimekey':
        payload = {...checkStatus(exposureStatus), ...payload, symptomonsent: ''};
        break;
      case 'en-toggle':
        payload = userStopped ? {...payload, state: 'off'} : {...payload, state: 'on'};
        break;
    }

    log.debug({message: 'metric', payload});
  };

  return addEvent;
};
