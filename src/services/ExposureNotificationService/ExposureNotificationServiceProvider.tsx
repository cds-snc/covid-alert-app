import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useI18nRef} from 'locale';
import ExposureNotification, {Status as SystemStatus} from 'bridge/ExposureNotification';
import {AppState, AppStateStatus, Platform} from 'react-native';
import RNSecureKeyStore from 'react-native-secure-key-store';
import SystemSetting from 'react-native-system-setting';
import {ContagiousDateInfo} from 'screens/datasharing/components';

import {BackendInterface} from '../BackendService';
import {BackgroundScheduler, DEFERRED_JOB_INTERNVAL_IN_MINUTES} from '../BackgroundSchedulerService';
import {useStorage} from '../StorageService';
import {daysBetween, minutesBetween} from '../../shared/date-fns';
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

  const status = exposureNotificationService.exposureStatus.get();
  const storageService = useStorage();
  const systemStatus = exposureNotificationService.systemStatus;

  useEffect(() => {
    const startExposureCheck = async () => {
      const today = new Date();
      const onboardedDatetime = storageService.onboardedDatetime;
      if (systemStatus.get() !== SystemStatus.Active) {
        captureMessage(`ExposureNotificationServiceProvider - System Status: ${systemStatus}`);
        return;
      }
      if (!onboardedDatetime) {
        // Do not perform Exposure Checks if onboarding is not completed.
        captureMessage('ExposureNotificationServiceProvider - Onboarded: FALSE');
        return;
      } else if (daysBetween(onboardedDatetime, today) < 1) {
        // Do not perform Exposure Checks on Same Day as Onboarding.
        captureMessage('ExposureNotificationServiceProvider - Onboarded: Same Day');
        return;
      }
      if (status.lastChecked) {
        captureMessage(`ExposureNotificationServiceProvider - LastChecked Timestamp: ${status.lastChecked.timestamp}`);
        const lastCheckedDate = new Date(status.lastChecked.timestamp);
        if (minutesBetween(lastCheckedDate, today) < DEFERRED_JOB_INTERNVAL_IN_MINUTES) {
          captureMessage('ExposureNotificationServiceProvider - Too soon to check.');
          return;
        }
      }
      captureMessage('useExposureNotificationSystemStatusAutomaticUpdater - OK ExposureCheck.');
      await exposureNotificationService.updateExposureStatus();
    };

    const onAppStateChange = async (newState: AppStateStatus) => {
      captureMessage(`ExposureNotificationServiceProvider onAppStateChange: ${newState}`);
      if (newState !== 'active') return;
      exposureNotificationService.updateExposure();
      await startExposureCheck();
    };

    // Note: The next two lines, calling updateExposure() and startExposureCheck() happen on app launch.
    exposureNotificationService.updateExposure();
    startExposureCheck();

    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [exposureNotificationService, status.lastChecked, storageService.onboardedDatetime, systemStatus]);

  return (
    <ExposureNotificationServiceContext.Provider value={exposureNotificationService}>
      {children}
    </ExposureNotificationServiceContext.Provider>
  );
};

export function useExposureNotificationService() {
  return useContext(ExposureNotificationServiceContext)!;
}

export function useStartExposureNotificationService(): () => Promise<void> {
  const exposureNotificationService = useExposureNotificationService();
  return useCallback(async () => {
    await exposureNotificationService.start();
  }, [exposureNotificationService]);
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

export function useUpdateExposureStatus(): () => void {
  const exposureNotificationService = useExposureNotificationService();
  const update = useCallback(() => {
    exposureNotificationService.updateExposureStatus();
  }, [exposureNotificationService]);
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
    (contagiousDateInfo: ContagiousDateInfo) => {
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
      captureMessage(`useExposureNotificationSystemStatusAutomaticUpdater onAppStateChange: ${newState}`);
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
