import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Box} from 'components';
import {
  ExposureStatusType,
  SystemStatus,
  useExposureStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';

import {BluetoothStatusOff} from './BluetoothStatusOff';
import {NotificationStatusOff} from './NotificationStatusOff';
import {SystemStatusOff} from './SystemStatusOff';
import {SystemStatusUnauthorized} from './SystemStatusUnauthorized';
import {DiagnosedThankYou} from './DiagnosedThankYou';

export const ConditionalMenuPanels = () => {
  const {userStopped} = useStorage();
  const exposureStatus = useExposureStatus();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  const turnNotificationsOnFn = notificationStatus === 'blocked' ? toSettings : turnNotificationsOn;
  const showNotificationWarning = notificationStatus !== 'granted';
  console.log('notificationStatus', notificationStatus);
  return (
    <>
      {/* <Box marginBottom="m" marginTop="s">
        <ShareDiagnosisCode />
      </Box> */}

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
      {exposureStatus.type === ExposureStatusType.Diagnosed && exposureStatus.hasShared && <DiagnosedThankYou />}
      {/* {showNotificationWarning && (
        <Box marginBottom="s">
          <NotificationStatusOff action={turnNotificationsOnFn} />
        </Box>
      )} */}
    </>
  );
};
