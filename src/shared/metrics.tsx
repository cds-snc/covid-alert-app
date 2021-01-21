/* eslint-disable no-case-declarations */
import {log} from 'shared/logging/config';
import {APP_VERSION_CODE, LOGGLY_URL} from 'env';
import {useMemo} from 'react';
import {
  useExposureStatus,
  ExposureStatusType,
  ExposureStatus,
  SystemStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';
import {getCurrentDate} from 'shared/date-fns';
import {Platform} from 'react-native';

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

// this will be replaces with DefaultMetricsJsonSerializer #1371
export class Logger {
  private appVersion: number;
  private appOs: string;

  constructor(appVersion: number, appOs: string) {
    console.log('===== new logger ======');
    this.appVersion = appVersion;
    this.appOs = appOs;
  }

  log(payload: any) {
    console.log(payload); // eslint-disable-line no-console

    if (LOGGLY_URL) {
      log.debug({
        category: 'metrics',
        message: payload.identifier,
        payload: {appVersion: this.appVersion, appOs: this.appOs},
      });
    }
  }
}

// this will be replaced with DefaultMetricsService #1371
class MetricsService implements MetricsService {
  static initialize(logger: Logger) {
    console.log('===== MetricsService initialize ======');
    return new MetricsService(logger);
  }

  private logger: any;

  private constructor(logger: any) {
    this.logger = logger;
  }

  sendMetrics(timestamp: number, identifier: string, region: string | undefined, data: {}): Promise<void> {
    return this.logger.log({timestamp, identifier, region, data});
  }
}

// note this can used direct i.e. outside of the React hook
export const sendMetricEvent = (payload: Payload, metricsService: MetricsService) => {
  const {timestamp, identifier, region, ...data} = payload;
  metricsService.sendMetrics(timestamp, identifier, region, data);
};

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();

  const metricsService = useMemo(() => {
    const metricsJsonSerializer = new Logger(APP_VERSION_CODE, Platform.OS);
    const metricsService = MetricsService.initialize(metricsJsonSerializer);
    return metricsService;
  }, []);

  const addEvent = (eventType: EventTypeMetric) => {
    const initialPayload: Metric = {identifier: eventType, timestamp: getCurrentDate().getTime(), region};

    switch (eventType) {
      case EventTypeMetric.Installed:
      case EventTypeMetric.Exposed:
        const metric: Metric = {...initialPayload};
        sendMetricEvent(metric, metricsService);
        break;
      case EventTypeMetric.Onboarded:
        const onboardedMetric: OnboardedMetric = {
          ...initialPayload,
          pushnotification: notificationStatus,
          frameworkenabled: systemStatus === SystemStatus.Active,
        };
        sendMetricEvent(onboardedMetric, metricsService);
        break;
      case EventTypeMetric.OtkNoDate:
      case EventTypeMetric.OtkWithDate:
        const otkMetric: OTKMetric = {...checkStatus(exposureStatus), ...initialPayload};
        sendMetricEvent(otkMetric, metricsService);
        break;
      case EventTypeMetric.EnToggle:
        const enToggleMetric: EnToggleMetric = userStopped
          ? {...initialPayload, state: false}
          : {...initialPayload, state: true};
        sendMetricEvent(enToggleMetric, metricsService);
        break;
    }
  };

  return addEvent;
};
