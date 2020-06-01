import React, {createContext, useCallback, useContext, useEffect, useState, useMemo} from 'react';
import {useI18n} from '@shopify/react-i18n';
import ExposureNotification, {Status as SystemStatus} from 'bridge/ExposureNotification';
import AsyncStorage from '@react-native-community/async-storage';
import SecureStorage from 'react-native-sensitive-info';

import {BackendInterface} from '../BackendService';
import {BackgroundScheduler} from '../BackgroundSchedulerService';

import {
  ExposureNotificationService,
  ExposureStatus,
  PersistencyProvider,
  SecurePersistencyProvider,
} from './ExposureNotificationService';

const ExposureNotificationServiceContext = createContext<ExposureNotificationService | undefined>(undefined);

export interface ExposureNotificationServiceProviderProps {
  backendInterface: BackendInterface;
  backgroundScheduler?: typeof BackgroundScheduler;
  exposureNotification?: typeof ExposureNotification;
  storage?: PersistencyProvider;
  secureStorage?: SecurePersistencyProvider;
  children?: React.ReactElement;
}

export const ExposureNotificationServiceProvider = ({
  backendInterface,
  backgroundScheduler = BackgroundScheduler,
  exposureNotification,
  storage,
  secureStorage,
  children,
}: ExposureNotificationServiceProviderProps) => {
  const [i18n] = useI18n();
  const exposureNotificationService = useMemo(
    () =>
      new ExposureNotificationService(
        backendInterface,
        i18n.translate,
        storage || AsyncStorage,
        secureStorage || SecureStorage,
        exposureNotification || ExposureNotification,
      ),
    [backendInterface, exposureNotification, i18n.translate, secureStorage, storage],
  );

  useEffect(() => {
    backgroundScheduler.registerPeriodicTask(() => {
      return exposureNotificationService.updateExposureStatusInBackground();
    });
  }, [backgroundScheduler, exposureNotificationService]);

  return (
    <ExposureNotificationServiceContext.Provider value={exposureNotificationService}>
      {children}
    </ExposureNotificationServiceContext.Provider>
  );
};

export function useStartENSystem(): () => void {
  const exposureNotificationService = useContext(ExposureNotificationServiceContext)!;
  return useCallback(() => {
    if (!exposureNotificationService.started) {
      exposureNotificationService.start();
    }
  }, [exposureNotificationService]);
}

export function useSystemStatus(): [SystemStatus, () => void] {
  const exposureNotificationService = useContext(ExposureNotificationServiceContext)!;
  const [state, setState] = useState<SystemStatus>(exposureNotificationService.systemStatus.value);
  const update = useCallback(() => {
    exposureNotificationService.updateSystemStatus();
  }, [exposureNotificationService]);

  useEffect(() => {
    return exposureNotificationService.systemStatus.observe(setState);
  }, [exposureNotificationService.systemStatus]);

  useEffect(update, [update]);

  return [state, update];
}

export function useExposureStatus(): [ExposureStatus, () => void] {
  const exposureNotificationService = useContext(ExposureNotificationServiceContext)!;
  const [state, setState] = useState<ExposureStatus>(exposureNotificationService.exposureStatus.value);
  const update = useCallback(() => {
    exposureNotificationService.updateExposureStatus();
  }, [exposureNotificationService]);

  useEffect(() => {
    return exposureNotificationService.exposureStatus.observe(setState);
  }, [exposureNotificationService.exposureStatus]);

  return [state, update];
}

export function useReportDiagnosis() {
  const exposureNotificationService = useContext(ExposureNotificationServiceContext)!;
  const startSubmission = useCallback(
    (oneTimeCode: string) => {
      return exposureNotificationService.startKeysSubmission(oneTimeCode);
    },
    [exposureNotificationService],
  );
  const fetchAndSubmitKeys = useCallback(() => {
    return exposureNotificationService.fetchAndSubmitKeys();
  }, [exposureNotificationService]);
  return {
    startSubmission,
    fetchAndSubmitKeys,
  };
}
