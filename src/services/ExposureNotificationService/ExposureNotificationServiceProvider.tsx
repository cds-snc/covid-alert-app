import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useI18nRef} from 'locale';
import ExposureNotification, {Status as SystemStatus} from 'bridge/ExposureNotification';
import {AppState, AppStateStatus, Platform} from 'react-native';
import SystemSetting from 'react-native-system-setting';
import {ContagiousDateInfo} from 'shared/DataSharing';
import {DefaultStorageService, StorageService, useCachedStorage} from 'services/StorageService';
import {log} from 'shared/logging/config';
import {checkNotifications} from 'react-native-permissions';
import {Status} from 'shared/NotificationPermissionStatus';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';

import {BackendInterface} from '../BackendService';
import {BackgroundScheduler} from '../BackgroundSchedulerService';

import {ExposureNotificationService, ExposureStatus, ProximityExposureHistoryItem} from './ExposureNotificationService';

const ExposureNotificationServiceContext = createContext<ExposureNotificationService | undefined>(undefined);

export interface ExposureNotificationServiceProviderProps {
  backendInterface: BackendInterface;
  backgroundScheduler?: typeof BackgroundScheduler;
  exposureNotification?: typeof ExposureNotification;
  storageService?: StorageService;
  children?: React.ReactElement;
}

export const ExposureNotificationServiceProvider = ({
  backendInterface,
  backgroundScheduler = BackgroundScheduler,
  exposureNotification,
  children,
}: ExposureNotificationServiceProviderProps) => {
  const i18n = useI18nRef();
  const {setUserStopped} = useCachedStorage();
  const exposureNotificationService = useMemo(
    () =>
      new ExposureNotificationService(
        backendInterface,
        i18n,
        DefaultStorageService.sharedInstance(),
        exposureNotification || ExposureNotification,
        FilteredMetricsService.sharedInstance(),
      ),
    [backendInterface, exposureNotification, i18n],
  );

  useEffect(() => {
    backgroundScheduler.registerPeriodicTask(async () => {
      await FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ActiveUser});
      await exposureNotificationService.updateExposureStatusInBackground();
    }, exposureNotificationService);
  }, [backgroundScheduler, exposureNotificationService]);

  useEffect(() => {
    const filteredMetricsService = FilteredMetricsService.sharedInstance();
    const onAppStateChange = async (newState: AppStateStatus) => {
      if (newState === 'background' && !(await exposureNotificationService.isUploading())) {
        exposureNotificationService.processOTKNotSharedNotification();
      } else if (newState !== 'active') {
        return;
      }
      exposureNotificationService.updateExposure();
      await exposureNotificationService.updateExposureStatus();

      await filteredMetricsService.addEvent({type: EventTypeMetric.ActiveUser});
      const notificationStatus: Status = await checkNotifications()
        .then(({status}) => status)
        .catch(() => 'unavailable');
      await filteredMetricsService.sendDailyMetrics(exposureNotificationService.systemStatus.get(), notificationStatus);

      if (exposureNotificationService.systemStatus.get() === SystemStatus.Active) {
        setUserStopped(false);
      }
      // re-register the background tasks upon app launch
      backgroundScheduler.registerPeriodicTask(async () => {
        await FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ActiveUser});
        await exposureNotificationService.updateExposureStatusInBackground();
      }, exposureNotificationService);
    };

    // Note: The next two lines, calling updateExposure() and startExposureCheck() happen on app launch.
    exposureNotificationService.updateExposure();
    exposureNotificationService.updateExposureStatus();

    filteredMetricsService
      .addEvent({type: EventTypeMetric.ActiveUser})
      .then(() => {
        // eslint-disable-next-line promise/no-nesting
        checkNotifications()
          .then(({status}) => status)
          .catch(() => 'unavailable')
          .then(notificationStatus => {
            filteredMetricsService.sendDailyMetrics(
              exposureNotificationService.systemStatus.get(),
              notificationStatus as Status,
            );
          })
          .catch(() => {});
      })
      .catch(() => {});

    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [backgroundScheduler, exposureNotificationService, setUserStopped]);

  return (
    <ExposureNotificationServiceContext.Provider value={exposureNotificationService}>
      {children}
    </ExposureNotificationServiceContext.Provider>
  );
};

export function useExposureNotificationService() {
  return useContext(ExposureNotificationServiceContext)!;
}

export function useStartExposureNotificationService(): (
  manualTrigger: boolean,
) => Promise<boolean | {success: boolean; error?: string}> {
  const exposureNotificationService = useExposureNotificationService();
  const {setUserStopped} = useCachedStorage();

  return useCallback(
    async (manualTrigger: boolean) => {
      const start = await exposureNotificationService.start();

      log.debug({message: 'exposureNotificationService.start()', payload: start});

      if (manualTrigger) {
        FilteredMetricsService.sharedInstance().addEvent({
          type: EventTypeMetric.EnToggle,
          state: true,
        });
      }

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

      if (start?.error === 'API_NOT_CONNECTED') {
        return {success: false, error: 'API_NOT_CONNECTED'};
      }

      return false;
    },
    [exposureNotificationService, setUserStopped],
  );
}

export function useStopExposureNotificationService(): (manualTrigger: boolean) => Promise<boolean> {
  const exposureNotificationService = useExposureNotificationService();
  const {setUserStopped} = useCachedStorage();
  return useCallback(
    async (manualTrigger: boolean) => {
      setUserStopped(true);
      const stopped = await exposureNotificationService.stop();

      log.debug({message: 'exposureNotificationService.stop()', payload: stopped});

      if (manualTrigger) {
        FilteredMetricsService.sharedInstance().addEvent({
          type: EventTypeMetric.EnToggle,
          state: false,
        });
      }

      return stopped;
    },
    [exposureNotificationService, setUserStopped],
  );
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

export function useExposureHistory(): number[] {
  const exposureNotificationService = useExposureNotificationService();
  const [history] = useState<number[]>(exposureNotificationService.exposureHistory.get());
  return history;
}

export function useDisplayExposureHistory() {
  const exposureNotificationService = useExposureNotificationService();
  const [history] = useState<ProximityExposureHistoryItem[]>(exposureNotificationService.displayExposureHistory.get());
  const proximityExposureHistory = history.filter(
    item => item.isIgnoredFromHistory === false && item.isExpired === false,
  );
  const ignoreAllProximityExposuresFromHistory = useCallback(() => {
    proximityExposureHistory.forEach(item => {
      exposureNotificationService.ignoreExposureFromHistory(item.id);
    });
  }, [exposureNotificationService, proximityExposureHistory]);
  return {proximityExposureHistory, ignoreAllProximityExposuresFromHistory};
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

  const setIsUploading = useCallback(
    async (status: boolean) => {
      return exposureNotificationService.setUploadStatus(status);
    },
    [exposureNotificationService],
  );

  return {
    startSubmission,
    fetchAndSubmitKeys,
    setIsUploading,
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
