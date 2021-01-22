/* eslint-disable no-case-declarations */
import {
  useExposureStatus,
  ExposureStatusType,
  ExposureStatus,
  SystemStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useMetricsContext} from 'shared/MetricsProvider';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';
import {getCurrentDate, getHoursBetween} from 'shared/date-fns';

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
  ExposedClear = 'exposed-clear',
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

interface ClearExposedMetric extends Metric {
  hoursSinceExposureDetectedAt: number;
}

type Payload = Metric | OnboardedMetric | OTKMetric | EnToggleMetric;

// note this can used direct i.e. outside of the React hook
export const sendMetricEvent = (payload: Payload, metricsService: any) => {
  const {timestamp, identifier, region, ...data} = payload;
  metricsService.sendMetrics(timestamp, identifier, region, data);
};

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();
  const metrics = useMetricsContext();

  const addEvent = (eventType: EventTypeMetric) => {
    const initialPayload: Metric = {identifier: eventType, timestamp: getCurrentDate().getTime(), region};

    switch (eventType) {
      case EventTypeMetric.Installed:
      case EventTypeMetric.Exposed:
        const metric: Metric = {...initialPayload};
        sendMetricEvent(metric, metrics.service);
        break;
      case EventTypeMetric.Onboarded:
        const onboardedMetric: OnboardedMetric = {
          ...initialPayload,
          pushnotification: notificationStatus,
          frameworkenabled: systemStatus === SystemStatus.Active,
        };
        sendMetricEvent(onboardedMetric, metrics.service);
        break;
      case EventTypeMetric.OtkNoDate:
      case EventTypeMetric.OtkWithDate:
        const otkMetric: OTKMetric = {...checkStatus(exposureStatus), ...initialPayload};
        sendMetricEvent(otkMetric, metrics.service);
        break;
      case EventTypeMetric.EnToggle:
        const enToggleMetric: EnToggleMetric = userStopped
          ? {...initialPayload, state: false}
          : {...initialPayload, state: true};
        sendMetricEvent(enToggleMetric, metrics.service);
        break;
      case EventTypeMetric.ExposedClear:
        if (exposureStatus.type !== ExposureStatusType.Exposed) {
          break;
        }

        const clearExposedMetric: ClearExposedMetric = {
          ...initialPayload,
          hoursSinceExposureDetectedAt: getHoursBetween(getCurrentDate(), new Date(exposureStatus.exposureDetectedAt)),
        };

        sendMetricEvent(clearExposedMetric, metrics.service);
        break;
    }
  };

  return addEvent;
};
