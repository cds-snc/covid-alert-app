import {log} from 'shared/logging/config';
import {useExposureStatus, ExposureStatusType, ExposureStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';

const checkStatus = (exposureStatus: ExposureStatus): {exposed: boolean} => {
  if (exposureStatus.type === ExposureStatusType.Exposed) {
    return {exposed: true};
  }

  return {exposed: false};
};

type EventType = 'onboarded' | 'otk' | 'enToggle';

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();

  const addEvent = (eventType: EventType) => {
    let payload: any = {timestamp: new Date().getTime(), region};

    switch (eventType) {
      case 'onboarded':
        payload = {...payload};
        break;
      case 'otk':
        payload = {...checkStatus(exposureStatus), ...payload};
        break;
      case 'enToggle':
        payload = userStopped ? {...payload, en: 'off'} : {...payload, en: 'on'};
        break;
    }

    console.log('===================================');

    log.debug({message: 'metric', payload});
  };

  return addEvent;
};
