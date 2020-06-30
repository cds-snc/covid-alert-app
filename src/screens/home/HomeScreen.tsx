import React, {useEffect, useState} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {BottomSheet, Box} from 'components';
import {DevSettings} from 'react-native';
import {
  SystemStatus,
  useExposureStatus,
  useStartExposureNotificationService,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useMaxContentWidth} from 'shared/useMaxContentWidth';
import {Theme} from 'shared/theme';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';

import {useExposureNotificationSystemStatusAutomaticUpdater} from '../../services/ExposureNotificationService';
import {RegionCase} from '../../shared/Region';

import {BluetoothDisabledView} from './views/BluetoothDisabledView';
import {CollapsedOverlayView} from './views/CollapsedOverlayView';
import {DiagnosedShareView} from './views/DiagnosedShareView';
import {DiagnosedView} from './views/DiagnosedView';
import {ExposureNotificationsDisabledView} from './views/ExposureNotificationsDisabledView';
import {ExposureView} from './views/ExposureView';
import {NoExposureUncoveredRegionView} from './views/NoExposureUncoveredRegionView';
import {NoExposureCoveredRegionView} from './views/NoExposureCoveredRegionView';
import {NoExposureNoRegionView} from './views/NoExposureNoRegionView';
import {NetworkDisabledView} from './views/NetworkDisabledView';
import {OverlayView} from './views/OverlayView';
import {
  useNotificationPermissionStatus,
  NotificationPermissionStatusProvider,
} from './components/NotificationPermissionStatus';

type BackgroundColor = keyof Theme['colors'];

interface ContentProps {
  setBackgroundColor: (color: string) => void;
}

const strToBackgroundColor = (backgroundColor: string): BackgroundColor => {
  const color: BackgroundColor = backgroundColor as BackgroundColor;
  return color;
};

const Content = ({setBackgroundColor}: ContentProps) => {
  const {region} = useStorage();
  const regionCase = getRegionCase(region);
  const [exposureStatus] = useExposureStatus();
  const [systemStatus] = useSystemStatus();
  const [, turnNotificationsOn] = useNotificationPermissionStatus();
  useEffect(() => {
    return turnNotificationsOn();
  }, [turnNotificationsOn]);

  const network = useNetInfo();
  setBackgroundColor('mainBackground');
  // this is for the test menu
  const {forceScreen} = useStorage();
  switch (forceScreen) {
    case 'ExposureView':
      return <ExposureView />;
    case 'DiagnosedShareView':
      return <DiagnosedShareView />;
    default:
      break;
  }

  const getNoExposureView = (_regionCase: RegionCase) => {
    switch (_regionCase) {
      case 'noRegionSet':
        return <NoExposureNoRegionView />;
      case 'regionCovered':
        return <NoExposureCoveredRegionView />;
      case 'regionNotCovered':
        return <NoExposureUncoveredRegionView />;
    }
  };

  // this case should be highest priority - if bluetooth is off, the app doesn't work
  if (systemStatus === SystemStatus.BluetoothOff) {
    return <BluetoothDisabledView />;
  }

  switch (exposureStatus.type) {
    case 'exposed':
      return <ExposureView />;
    case 'diagnosed':
      return exposureStatus.needsSubmission ? <DiagnosedShareView /> : <DiagnosedView />;
    case 'monitoring':
    default:
      if (!network.isConnected && network.type !== 'unknown') return <NetworkDisabledView />;
      switch (systemStatus) {
        case SystemStatus.Disabled:
        case SystemStatus.Restricted:
          return <ExposureNotificationsDisabledView />;
        case SystemStatus.Active:
          return getNoExposureView(regionCase);
        default:
          // return null;
          return getNoExposureView(regionCase);
      }
  }
};

const CollapsedContent = () => {
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';

  // if (systemStatus === SystemStatus.Unknown) {
  //   return null;
  // }

  return (
    <CollapsedOverlayView
      status={systemStatus}
      notificationWarning={showNotificationWarning}
      turnNotificationsOn={turnNotificationsOn}
    />
  );
};

const BottomSheetContent = () => {
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';
  const maxWidth = useMaxContentWidth();

  // if (systemStatus === SystemStatus.Unknown) {
  //   return null;
  // }

  return (
    <OverlayView
      status={systemStatus}
      notificationWarning={showNotificationWarning}
      turnNotificationsOn={turnNotificationsOn}
      maxWidth={maxWidth}
    />
  );
};

const BottomSheetWrapper = () => {
  const [notificationStatus] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';
  return (
    <BottomSheet content={BottomSheetContent} collapsed={CollapsedContent} extraContent={showNotificationWarning} />
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem('Show Test Menu', () => {
        navigation.dispatch(DrawerActions.openDrawer());
      });
    }
  }, [navigation]);

  // This only initiate system status updater.
  // The actual updates will be delivered in useSystemStatus().
  const subscribeToStatusUpdates = useExposureNotificationSystemStatusAutomaticUpdater();
  useEffect(() => {
    return subscribeToStatusUpdates();
  }, [subscribeToStatusUpdates]);

  const startExposureNotificationService = useStartExposureNotificationService();
  useEffect(() => {
    startExposureNotificationService();
  }, [startExposureNotificationService]);

  const maxWidth = useMaxContentWidth();
  const [backgroundColor, setBackgroundColor] = useState<string>('mainBackground');

  return (
    <NotificationPermissionStatusProvider>
      <Box flex={1} alignItems="center" backgroundColor={strToBackgroundColor(backgroundColor)}>
        <Box flex={1} maxWidth={maxWidth} paddingTop="m" alignSelf="stretch">
          <Content setBackgroundColor={setBackgroundColor} />
        </Box>
        <BottomSheetWrapper />
      </Box>
    </NotificationPermissionStatusProvider>
  );
};
