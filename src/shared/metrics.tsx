import {
  useExposureStatus,
  ExposureStatusType,
  SystemStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useMetricsContext} from 'shared/MetricsProvider';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';
import {getCurrentDate, getHoursBetween} from 'shared/date-fns';
import {MetricsService} from 'services/MetricsService/MetricsService';
import {Metric} from 'services/MetricsService/Metric';

export enum EventTypeMetric {
  Installed = 'installed',
  Onboarded = 'onboarded',
  Exposed = 'exposed',
  OtkNoDate = 'otk-no-date',
  OtkWithDate = 'otk-with-date',
  EnToggle = 'en-toggle',
  ExposedClear = 'exposed-clear',
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

interface ClearExposedMetric extends BaseMetric {
  hoursSinceExposureDetectedAt: number;
}

type Payload = BaseMetric | OnboardedMetric | OTKMetric | EnToggleMetric | ClearExposedMetric;

// note this can used direct i.e. outside of the React hook
export const sendMetricEvent = (payload: Payload, metricsService: MetricsService) => {
  const {timestamp, identifier, region, ...data} = payload;

  const events: [string, string][] = [];
  for (const [key, value] of Object.entries(data)) {
    events.push([key, String(value || '')]);
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
        break;
      case EventTypeMetric.EnToggle:
        newMetricPayload = [['state', String(userStopped)]];
        break;
      case EventTypeMetric.ExposedClear:
        if (exposureStatus.type !== ExposureStatusType.Exposed) {
          break;
        }
        newMetricPayload = [
          [
            'hoursSinceExposureDetectedAt',
            String(getHoursBetween(getCurrentDate(), new Date(exposureStatus.exposureDetectedAt))),
          ],
        ];
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
