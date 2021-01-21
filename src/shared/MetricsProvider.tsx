import React, {useContext} from 'react';
import {log} from 'shared/logging/config';
import {APP_VERSION_CODE, LOGGLY_URL} from 'env';
import {Platform} from 'react-native';

interface MetricsProviderProps {
  children?: React.ReactElement;
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

const MetricsContext = React.createContext<MetricsProviderProps | undefined>(undefined);

const createMetricsService = () => {
  const metricsJsonSerializer = new Logger(APP_VERSION_CODE, Platform.OS);
  const metricsService = MetricsService.initialize(metricsJsonSerializer);
  return {metricsService};
};

export const MetricsProvider = ({children}: MetricsProviderProps) => {
  const value = createMetricsService();

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
};

export const useMetricsProvider = () => {
  return useContext(MetricsContext)!!;
};
