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
import {getCurrentDate} from 'shared/date-fns';
import {MetricsService} from 'services/MetricsService/MetricsService';
import {Metric} from 'services/MetricsService/Metric';

const checkStatus = (exposureStatus: ExposureStatus): boolean => {
  if (exposureStatus.type === ExposureStatusType.Exposed) {
    return true;
  }

  return false;
};

export enum EventTypeMetric {
  Installed = 'installed',
  Onboarded = 'onboarded',
  Exposed = 'exposed',
  OtkNoDate = 'otk-no-date',
  OtkWithDate = 'otk-with-date',
  EnToggle = 'en-toggle',
}

interface BaseMetric {
  identifier: string;
  timestamp: number;
  region: string | undefined;
}

interface OnboardedMetric extends BaseMetric {
  pushnotification: string;
  frameworkenabled: boolean;
}

interface OTKMetric extends BaseMetric {
  exposed: boolean;
}

interface EnToggleMetric extends BaseMetric {
  state: boolean;
}

type Payload = BaseMetric | OnboardedMetric | OTKMetric | EnToggleMetric;

// note this can used direct i.e. outside of the React hook
export const sendMetricEvent = (payload: Payload, metricsService: MetricsService) => {
  const {timestamp, identifier, region, ...data} = payload;

  let events: [string, string][] = [];
  for (const [key, value] of Object.entries(data)) {
    const val = value || '';
    events.push([key, String(val)]);
  }

  const newMetric = new Metric(timestamp, identifier, region ?? 'None', [...events]);
  metricsService.publishMetric(newMetric);
};

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();
  const metrics = useMetricsContext();

  const addEvent = (eventType: EventTypeMetric) => {
    const initialPayload: BaseMetric = {identifier: eventType, timestamp: getCurrentDate().getTime(), region};

    let newMetricPayload: [string, string][] = [];

    switch (eventType) {
      case EventTypeMetric.Installed:
      case EventTypeMetric.Exposed:
        break;
      case EventTypeMetric.Onboarded:
        newMetricPayload = [
          ['pushnotification', String(notificationStatus)],
          ['frameworkenabled', String(systemStatus === SystemStatus.Active)],
        ];
        break;
      case EventTypeMetric.OtkNoDate:
      case EventTypeMetric.OtkWithDate:
        newMetricPayload = [['exposed', String(checkStatus(exposureStatus))]];
        break;
      case EventTypeMetric.EnToggle:
        newMetricPayload = [['state', String(userStopped)]];
        break;
    }

    const newMetric = new Metric(
      initialPayload.timestamp,
      initialPayload.identifier,
      initialPayload.region ?? 'None',
      newMetricPayload,
    );
    metrics.service?.publishMetric(newMetric);
  };

  return addEvent;
};
