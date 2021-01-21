import React, {useContext} from 'react';
import {APP_VERSION_CODE} from 'env';
import {Platform} from 'react-native';
import {DefaultMetricsService, MetricsService} from 'services/MetricsService/MetricsService';
import {DefaultMetricsJsonSerializer} from 'services/MetricsService/MetricsJsonSerializer';

interface MetricsProviderProps {
  service?: MetricsService;
  children?: React.ReactElement;
}

const MetricsContext = React.createContext<MetricsProviderProps | undefined>(undefined);

const createMetricsService = () => {
  const metricsJsonSerializer = new DefaultMetricsJsonSerializer(String(APP_VERSION_CODE), Platform.OS);
  const metricsService = DefaultMetricsService.initialize(metricsJsonSerializer);

  return metricsService;
};

export const MetricsProvider = ({children}: MetricsProviderProps) => {
  const service = createMetricsService();

  return <MetricsContext.Provider value={{service}}>{children}</MetricsContext.Provider>;
};

export const useMetricsContext = () => {
  return useContext(MetricsContext)!!;
};
