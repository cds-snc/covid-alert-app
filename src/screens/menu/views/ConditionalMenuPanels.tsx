import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Box} from 'components';
import {
  ExposureStatusType,
  SystemStatus,
  useExposureStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useCachedStorage} from 'services/StorageService';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNotificationPermissionStatus} from 'shared/NotificationPermissionStatus';

import {BluetoothStatusOff} from './BluetoothStatusOff';
import {NotificationStatusOff} from './NotificationStatusOff';
import {SystemStatusOff} from './SystemStatusOff';
import {SystemStatusUnauthorized} from './SystemStatusUnauthorized';
import {DiagnosedThankYou} from './DiagnosedThankYou';
import {OfflineWarning} from './OfflineWarning';

export const ConditionalMenuPanels = () => {
  const {userStopped} = useCachedStorage();
  const exposureStatus = useExposureStatus();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  const turnNotificationsOnFn = notificationStatus === 'blocked' ? toSettings : turnNotificationsOn;
  const showNotificationWarning = notificationStatus !== 'granted';
  const network = useNetInfo();

  return (
    <>
      {!userStopped && (systemStatus === SystemStatus.Disabled || systemStatus === SystemStatus.Restricted) && (
        <Box marginBottom="s">
          <SystemStatusOff />
        </Box>
      )}
      {!userStopped && systemStatus === SystemStatus.Unauthorized && (
        <Box marginBottom="s">
          <SystemStatusUnauthorized />
        </Box>
      )}
      {systemStatus === SystemStatus.BluetoothOff && (
        <Box marginBottom="s">
          <BluetoothStatusOff />
        </Box>
      )}
      {exposureStatus.type === ExposureStatusType.Diagnosed && exposureStatus.hasShared && (
        <Box marginBottom="s">
          <DiagnosedThankYou />
        </Box>
      )}

      {!network.isConnected && exposureStatus.type !== ExposureStatusType.Diagnosed && (
        <Box marginBottom="s">
          <OfflineWarning />
        </Box>
      )}
      {showNotificationWarning && (
        <Box marginBottom="s">
          <NotificationStatusOff action={turnNotificationsOnFn} />
        </Box>
      )}
    </>
  );
};
