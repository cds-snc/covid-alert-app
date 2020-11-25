import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useI18nRef} from 'locale';
import ExposureNotification, {Status as SystemStatus} from 'bridge/ExposureNotification';
import {AppState, AppStateStatus, Platform} from 'react-native';
import RNSecureKeyStore from 'react-native-secure-key-store';
import SystemSetting from 'react-native-system-setting';
import {ContagiousDateInfo} from 'shared/DataSharing';
import {useStorage} from 'services/StorageService';

import {BackendInterface} from '../BackendService';
import {BackgroundScheduler} from '../BackgroundSchedulerService';
import {captureMessage} from '../../shared/log';

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
  const i18n = useI18nRef();
  const {setUserStopped} = useStorage();
  const exposureNotificationService = useMemo(
    () =>
      new ExposureNotificationService(
        backendInterface,
        i18n,
        storage || AsyncStorage,
        secureStorage || RNSecureKeyStore,
        exposureNotification || ExposureNotification,
      ),
    [backendInterface, exposureNotification, i18n, secureStorage, storage],
  );

  useEffect(() => {
    backgroundScheduler.registerPeriodicTask(async () => {
      await exposureNotificationService.updateExposureStatusInBackground();
    });
  }, [backgroundScheduler, exposureNotificationService]);

  useEffect(() => {
    const onAppStateChange = async (newState: AppStateStatus) => {
      captureMessage(`ExposureNotificationServiceProvider onAppStateChange: ${newState}`);
      if (newState !== 'active') return;
      exposureNotificationService.updateExposure();
      await exposureNotificationService.updateExposureStatus();
      if (exposureNotificationService.systemStatus.get() === SystemStatus.Active) {
        setUserStopped(false);
      }
    };

    // Note: The next two lines, calling updateExposure() and startExposureCheck() happen on app launch.
    exposureNotificationService.updateExposure();
    exposureNotificationService.updateExposureStatus();

    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [exposureNotificationService, setUserStopped]);

  return (
    <ExposureNotificationServiceContext.Provider value={exposureNotificationService}>
      {children}
    </ExposureNotificationServiceContext.Provider>
  );
};

export function useExposureNotificationService() {
  return useContext(ExposureNotificationServiceContext)!;
}

export function useStartExposureNotificationService(): () => Promise<boolean> {
  const exposureNotificationService = useExposureNotificationService();
  const {setUserStopped} = useStorage();

  return useCallback(async () => {
    const start = await exposureNotificationService.start();
    captureMessage(`useStartExposureNotificationService ${start}`);
    if (Platform.OS === 'ios') {
      setUserStopped(false);
    }
    if (start?.error === 'PERMISSION_DENIED') {
      return false;
    }
    if (start.success) {
      setUserStopped(false);
      return true;
    }
    return false;
  }, [exposureNotificationService, setUserStopped]);
}

export function useStopExposureNotificationService(): () => Promise<boolean> {
  const exposureNotificationService = useExposureNotificationService();
  const {setUserStopped} = useStorage();
  return useCallback(async () => {
    setUserStopped(true);
    const stopped = await exposureNotificationService.stop();
    captureMessage(`useStopExposureNotificationService ${stopped}`);
    return stopped;
  }, [exposureNotificationService, setUserStopped]);
}

export function useSystemStatus(): [SystemStatus, () => void] {
  const exposureNotificationService = useExposureNotificationService();
  const [state, setState] = useState<SystemStatus>(exposureNotificationService.systemStatus.get());
  const update = useCallback(() => {
    exposureNotificationService.updateSystemStatus();
  }, [exposureNotificationService]);

  useEffect(() => {
    return exposureNotificationService.systemStatus.observe(setState);
  }, [exposureNotificationService.systemStatus]);

  return [state, update];
}

export function useExposureStatus(): ExposureStatus {
  const exposureNotificationService = useExposureNotificationService();
  const [state, setState] = useState<ExposureStatus>(exposureNotificationService.exposureStatus.get());
  useEffect(() => {
    return exposureNotificationService.exposureStatus.observe(setState);
  }, [exposureNotificationService.exposureStatus]);

  return state;
}

export function useUpdateExposureStatus(): (forceCheck?: boolean) => void {
  const exposureNotificationService = useExposureNotificationService();
  const update = useCallback(
    (forceCheck = false) => {
      exposureNotificationService.updateExposureStatus(forceCheck);
    },
    [exposureNotificationService],
  );

  return update;
}

export function useReportDiagnosis() {
  const exposureNotificationService = useExposureNotificationService();
  const startSubmission = useCallback(
    (oneTimeCode: string) => {
      return exposureNotificationService.startKeysSubmission(oneTimeCode);
    },
    [exposureNotificationService],
  );
  const fetchAndSubmitKeys = useCallback(
    async (contagiousDateInfo: ContagiousDateInfo) => {
      return exposureNotificationService.fetchAndSubmitKeys(contagiousDateInfo);
    },
    [exposureNotificationService],
  );
  return {
    startSubmission,
    fetchAndSubmitKeys,
  };
}

export function useExposureNotificationSystemStatusAutomaticUpdater() {
  const exposureNotificationService = useExposureNotificationService();
  return useCallback(() => {
    const updateStatus = async (newState: AppStateStatus) => {
      if (newState !== 'active') return;
      await exposureNotificationService.updateSystemStatus();
    };
    AppState.addEventListener('change', updateStatus);

    const bluetoothListenerPromise = SystemSetting.addBluetoothListener(() => {
      exposureNotificationService.updateSystemStatus();
    });

    const locationListenerPromise =
      Platform.OS === 'android'
        ? SystemSetting.addLocationListener(() => {
            exposureNotificationService.updateSystemStatus();
          })
        : undefined;

    return () => {
      AppState.removeEventListener('change', updateStatus);
      bluetoothListenerPromise.then(listener => listener.remove()).catch(() => {});
      locationListenerPromise?.then(listener => listener.remove()).catch(() => {});
    };
  }, [exposureNotificationService]);
}

export function useClearExposedStatus(): [() => void] {
  const exposureNotificationService = useExposureNotificationService();

  const clearExposedStatus = useCallback(() => {
    exposureNotificationService.clearExposedStatus();
  }, [exposureNotificationService]);

  return [clearExposedStatus];
}
