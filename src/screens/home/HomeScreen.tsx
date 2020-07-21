import React, {useCallback, useEffect, useState, useRef, useLayoutEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {BottomSheet, BottomSheetBehavior, Box} from 'components';
import {DevSettings, Linking} from 'react-native';
import {
  SystemStatus,
  useExposureStatus,
  useStartExposureNotificationService,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {Theme} from 'shared/theme';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {usePrevious} from 'shared/usePrevious';

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
  isBottomSheetExpanded: boolean;
}

const strToBackgroundColor = (backgroundColor: string): BackgroundColor => {
  const color: BackgroundColor = backgroundColor as BackgroundColor;
  return color;
};

const Content = ({setBackgroundColor, isBottomSheetExpanded}: ContentProps) => {
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
      return <ExposureView isBottomSheetExpanded={isBottomSheetExpanded} />;
    case 'DiagnosedShareView':
      return <DiagnosedShareView isBottomSheetExpanded={isBottomSheetExpanded} />;
    default:
      break;
  }

  const getNoExposureView = (_regionCase: RegionCase) => {
    switch (_regionCase) {
      case 'noRegionSet':
        return <NoExposureNoRegionView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case 'regionCovered':
        return <NoExposureCoveredRegionView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case 'regionNotCovered':
        return <NoExposureUncoveredRegionView isBottomSheetExpanded={isBottomSheetExpanded} />;
    }
  };

  // this case should be highest priority - if bluetooth is off, the app doesn't work
  if (systemStatus === SystemStatus.BluetoothOff) {
    return <BluetoothDisabledView />;
  }

  switch (exposureStatus.type) {
    case 'exposed':
      return <ExposureView isBottomSheetExpanded={isBottomSheetExpanded} />;
    case 'diagnosed':
      return exposureStatus.needsSubmission ? (
        <DiagnosedShareView isBottomSheetExpanded={isBottomSheetExpanded} />
      ) : (
        <DiagnosedView isBottomSheetExpanded={isBottomSheetExpanded} />
      );
    case 'monitoring':
    default:
      if (!network.isConnected && network.type !== 'unknown') return <NetworkDisabledView />;
      switch (systemStatus) {
        case SystemStatus.Disabled:
        case SystemStatus.Restricted:
          return <ExposureNotificationsDisabledView isBottomSheetExpanded={isBottomSheetExpanded} />;
        case SystemStatus.Active:
          return getNoExposureView(regionCase);
        default:
          // return null;
          return getNoExposureView(regionCase);
      }
  }
};

const CollapsedContent = (bottomSheetBehavior: BottomSheetBehavior) => {
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
      bottomSheetBehavior={bottomSheetBehavior}
    />
  );
};

const ExpandedContent = (bottomSheetBehavior: BottomSheetBehavior) => {
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  const turnNotificationsOnFn = notificationStatus === 'blocked' ? toSettings : turnNotificationsOn;
  // if (systemStatus === SystemStatus.Unknown) {
  //   return null;
  // }

  return (
    <OverlayView
      status={systemStatus}
      notificationWarning={showNotificationWarning}
      turnNotificationsOn={turnNotificationsOnFn}
      bottomSheetBehavior={bottomSheetBehavior}
    />
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

  const [backgroundColor, setBackgroundColor] = useState<string>('mainBackground');

  const bottomSheetRef = useRef<BottomSheetBehavior>(null);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const currentStatus = useExposureStatus()[0].type;
  const previousStatus = usePrevious(currentStatus);
  useLayoutEffect(() => {
    if (previousStatus === 'monitoring' && currentStatus === 'diagnosed') {
      bottomSheetRef.current?.collapse();
    }
  }, [currentStatus, previousStatus]);
  useLayoutEffect(() => {
    bottomSheetRef.current?.setOnStateChange(setIsBottomSheetExpanded);
  }, []);

  return (
    <NotificationPermissionStatusProvider>
      <Box flex={1} alignItems="center" backgroundColor={strToBackgroundColor(backgroundColor)}>
        <Box
          flex={1}
          paddingTop="m"
          paddingBottom="m"
          alignSelf="stretch"
          accessibilityElementsHidden={isBottomSheetExpanded}
          importantForAccessibility={isBottomSheetExpanded ? 'no-hide-descendants' : undefined}
        >
          <Content isBottomSheetExpanded={isBottomSheetExpanded} setBackgroundColor={setBackgroundColor} />
        </Box>
        <BottomSheet ref={bottomSheetRef} expandedComponent={ExpandedContent} collapsedComponent={CollapsedContent} />
      </Box>
    </NotificationPermissionStatusProvider>
  );
};
