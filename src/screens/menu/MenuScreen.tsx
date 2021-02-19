import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';
import {useSystemStatus} from 'services/ExposureNotificationService';

import {OverlayView} from './components/OverlayView';

export const MenuScreen = () => {
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  const turnNotificationsOnFn = notificationStatus === 'blocked' ? toSettings : turnNotificationsOn;

  return (
    <OverlayView
      status={systemStatus}
      notificationWarning={showNotificationWarning}
      turnNotificationsOn={turnNotificationsOnFn}
    />
  );
};
