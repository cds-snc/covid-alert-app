import React, {useMemo, useState, useEffect} from 'react';
import {AppState, AppStateStatus, DevSettings} from 'react-native';
import {BottomSheet, Box} from 'components';
import {useExposureStatus, useSystemStatus, SystemStatus, useStartENSystem} from 'services/ExposureNotificationService';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useMaxContentWidth} from 'shared/useMaxContentWidth';

import {ExposureNotificationsDisabledView} from './views/ExposureNotificationsDisabledView';
import {BluetoothDisabledView} from './views/BluetoothDisabledView';
import {NetworkDisabledView} from './views/NetworkDisabledView';
import {DiagnosedView} from './views/DiagnosedView';
import {DiagnosedShareView} from './views/DiagnosedShareView';
import {ExposureView} from './views/ExposureView';
import {NoExposureView} from './views/NoExposureView';
import {OverlayView} from './views/OverlayView';
import {CollapsedOverlayView} from './views/CollapsedOverlayView';

type NotificationPermission = 'denied' | 'granted' | 'unavailable' | 'blocked';

const useNotificationPermissionStatus = (): [string, () => void] => {
  const [status, setStatus] = useState<NotificationPermission>('granted');

  checkNotifications()
    .then(({status}) => {
      setStatus(status);
    })
    .catch(error => {
      console.log(error);
      setStatus('unavailable');
    });

  const request = () => {
    requestNotifications(['alert'])
      .then(({status}) => {
        setStatus(status);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return [status === 'granted' ? status : 'denied', request];
};

const Content = () => {
  const [exposureStatus, updateExposureStatus] = useExposureStatus();
  const [systemStatus, updateSystemStatus] = useSystemStatus();
  const startSystem = useStartENSystem();

  useEffect(() => {
    startSystem();
  }, [startSystem]);

  const network = useNetInfo();

  useEffect(() => {
    const updateStatus = (newState: AppStateStatus) => {
      if (newState === 'active') {
        updateExposureStatus();
        updateSystemStatus();
      }
    };

    AppState.addEventListener('change', updateStatus);

    return () => {
      AppState.removeEventListener('change', updateStatus);
    };
  }, [updateExposureStatus, updateSystemStatus]);

  switch (exposureStatus.type) {
    case 'exposed':
      return <ExposureView />;
    case 'diagnosed':
      return exposureStatus.needsSubmission ? <DiagnosedShareView /> : <DiagnosedView />;
    case 'monitoring':
    default:
      if (!network.isConnected) return <NetworkDisabledView />;
      switch (systemStatus) {
        case SystemStatus.Disabled:
        case SystemStatus.Restricted:
          return <ExposureNotificationsDisabledView />;
        case SystemStatus.BluetoothOff:
          return <BluetoothDisabledView />;
        case SystemStatus.Active:
        case SystemStatus.Unknown:
          return <NoExposureView />;
      }
  }
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  React.useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem('Show Test Menu', () => {
        navigation.dispatch(DrawerActions.openDrawer());
      });
    }
  }, [navigation]);

  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus === 'denied';
  const collapsedContent = useMemo(
    () => (
      <CollapsedOverlayView
        status={systemStatus}
        notificationWarning={showNotificationWarning}
        turnNotificationsOn={turnNotificationsOn}
      />
    ),
    [showNotificationWarning, systemStatus, turnNotificationsOn],
  );

  const maxWidth = useMaxContentWidth();

  return (
    <Box flex={1} alignItems="center" backgroundColor="mainBackground">
      <Box flex={1} maxWidth={maxWidth} paddingTop="m">
        <Content />
      </Box>
      <BottomSheet
        // need to change the key here so bottom sheet is rerendered. This is because the snap points change.
        key={showNotificationWarning ? 'notifications-disabled' : 'notifications-enabled'}
        collapsedContent={collapsedContent}
        extraContent={showNotificationWarning}
      >
        <OverlayView
          status={systemStatus}
          notificationWarning={showNotificationWarning}
          turnNotificationsOn={turnNotificationsOn}
          maxWidth={maxWidth}
        />
      </BottomSheet>
    </Box>
  );
};
