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
import {LOGGLY_URL} from 'env';
import {getCurrentDate} from 'shared/date-fns';

const checkStatus = (exposureStatus: ExposureStatus): {exposed: boolean} => {
  if (exposureStatus.type === ExposureStatusType.Exposed) {
    return {exposed: true};
  }

  return {exposed: false};
};

export enum EventTypeMetric {
  Installed = 'installed',
  Onboarded = 'onboarded',
  Exposed = 'exposed',
  OtkNoDate = 'otk-no-date',
  OtkWithDate = 'otk-with-date',
  EnToggle = 'en-toggle',
}

interface Metric {
  identifier: string;
  timestamp: number;
  region: string | undefined;
}

interface OnboardedMetric extends Metric {
  pushnotification: string;
  frameworkenabled: boolean;
}

interface OTKMetric extends Metric {
  exposed: boolean;
}

interface EnToggleMetric extends Metric {
  state: boolean;
}

type Payload = Metric | OnboardedMetric | OTKMetric | EnToggleMetric;

// note this can used direct i.e. outside of the React hook
export const sendMetricEvent = (payload: Payload) => {
  if (LOGGLY_URL) {
    log.debug({category: 'metrics', message: payload.identifier, payload});
  }
};

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();

  const addEvent = (eventType: EventTypeMetric) => {
    const initialPayload: Metric = {identifier: eventType, timestamp: getCurrentDate().getTime(), region};
    let payload: Payload = {...initialPayload};

    switch (eventType) {
      case EventTypeMetric.Installed:
        break;
      case EventTypeMetric.Onboarded:
        payload = {
          ...initialPayload,
          pushnotification: notificationStatus,
          frameworkenabled: systemStatus === SystemStatus.Active,
        };
        break;
      case EventTypeMetric.Exposed:
        break;
      case EventTypeMetric.OtkNoDate:
        payload = {...checkStatus(exposureStatus), ...initialPayload};
        break;
      case EventTypeMetric.OtkWithDate:
        payload = {...checkStatus(exposureStatus), ...initialPayload};
        break;
      case EventTypeMetric.EnToggle:
        payload = userStopped ? {...initialPayload, state: false} : {...initialPayload, state: true};
        break;
    }

    sendMetricEvent(payload);
  };

  return addEvent;
};
