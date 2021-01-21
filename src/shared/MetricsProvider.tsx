import React, {useContext} from 'react';
import {log} from 'shared/logging/config';
import {APP_VERSION_CODE, LOGGLY_URL} from 'env';
import {Platform} from 'react-native';

interface MetricsProviderProps {
  service: MetricsService;
  children?: React.ReactElement;
}

// this will be replaced with DefaultMetricsService #1371
class MetricsService implements MetricsService {
  private logger: any;

  public constructor(logger: any) {
    this.logger = logger;
  }

  public sendMetrics(timestamp: number, identifier: string, region: string | undefined, data: {}): Promise<void> {
    return this.logger.log({timestamp, identifier, region, data});
  }
}

// this will be replaces with DefaultMetricsJsonSerializer #1371
export class Logger {
  private appVersion: number;
  private appOs: string;

  constructor(appVersion: number, appOs: string) {
    this.appVersion = appVersion;
    this.appOs = appOs;
  }

  public log(payload: any) {
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
  const metricsService = new MetricsService(metricsJsonSerializer);

  return metricsService;
};

export const MetricsProvider = ({children}: MetricsProviderProps) => {
  const service = createMetricsService();

  return <MetricsContext.Provider value={{service}}>{children}</MetricsContext.Provider>;
};

export const useMetricsContext = () => {
  return useContext(MetricsContext)!!;
};
