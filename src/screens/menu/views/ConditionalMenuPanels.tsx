import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Box} from 'components';
import {SystemStatus, useSystemStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';

import {BluetoothStatusOff} from './BluetoothStatusOff';
import {NotificationStatusOff} from './NotificationStatusOff';
import {ShareDiagnosisCode} from './ShareDiagnosisCode';
import {SystemStatusOff} from './SystemStatusOff';
import {SystemStatusUnauthorized} from './SystemStatusUnauthorized';
import {TurnAppBackOn} from './TurnAppBackOn';

export const ConditionalMenuPanels = () => {
  const {userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  const turnNotificationsOnFn = notificationStatus === 'blocked' ? toSettings : turnNotificationsOn;
  const showNotificationWarning = notificationStatus !== 'granted';
  return (
    <>
      {userStopped && systemStatus !== SystemStatus.Active && (
        <Box marginBottom="m" marginTop="l">
          <TurnAppBackOn />
        </Box>
      )}

      {/* <Box marginBottom="m" marginTop="s">
        <ShareDiagnosisCode />
      </Box> */}

      {!userStopped && (systemStatus === SystemStatus.Disabled || systemStatus === SystemStatus.Restricted) && (
        <Box marginBottom="m">
          <SystemStatusOff />
        </Box>
      )}
      {!userStopped && systemStatus === SystemStatus.Unauthorized && (
        <Box marginBottom="m">
          <SystemStatusUnauthorized />
        </Box>
      )}
      {systemStatus === SystemStatus.BluetoothOff && (
        <Box marginBottom="m">
          <BluetoothStatusOff />
        </Box>
      )}
      {showNotificationWarning && (
        <Box marginBottom="m">
          <NotificationStatusOff action={turnNotificationsOnFn} />
        </Box>
      )}
    </>
  );
};
