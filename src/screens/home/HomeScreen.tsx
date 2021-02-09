import React, {useCallback, useEffect, useState, useRef, useLayoutEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {BottomSheet, BottomSheetBehavior, Box} from 'components';
import {DevSettings, Linking, Animated} from 'react-native';
import {TEST_MODE} from 'env';
import {
  ExposureStatusType,
  SystemStatus,
  useExposureStatus,
  useUpdateExposureStatus,
  useStartExposureNotificationService,
  useExposureNotificationSystemStatusAutomaticUpdater,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {RegionCase} from 'shared/Region';
import {getRegionCase} from 'shared/RegionLogic';
import {usePrevious} from 'shared/usePrevious';
import {ForceScreen} from 'shared/ForceScreen';
import {useRegionalI18n} from 'locale';

import {BluetoothDisabledView} from './views/BluetoothDisabledView';
import {CollapsedOverlayView} from './views/CollapsedOverlayView';
import {DiagnosedShareView} from './views/DiagnosedShareView';
import {DiagnosedView} from './views/DiagnosedView';
import {DiagnosedShareUploadView} from './views/DiagnosedShareUploadView';
import {ExposureNotificationsDisabledView} from './views/ExposureNotificationsDisabledView';
import {ExposureNotificationsUnauthorizedView} from './views/ExposureNotificationsUnauthorizedView';
import {ExposureView} from './views/ExposureView';
import {NoExposureUncoveredRegionView} from './views/NoExposureUncoveredRegionView';
import {NoExposureCoveredRegionView} from './views/NoExposureCoveredRegionView';
import {NoExposureNoRegionView} from './views/NoExposureNoRegionView';
import {NetworkDisabledView} from './views/NetworkDisabledView';
import {OverlayView} from './views/OverlayView';
import {FrameworkUnavailableView} from './views/FrameworkUnavailableView';
import {ExposureNotificationsUserStoppedView} from './views/ExposureNotificationsUserStoppedView';
import {UnknownProblemView} from './views/UnknownProblemView';
import {
  useNotificationPermissionStatus,
  NotificationPermissionStatusProvider,
} from './components/NotificationPermissionStatus';
import {LocationOffView} from './views/LocationOffView';
import {BaseHomeView} from './components/BaseHomeView';

interface ContentProps {
  isBottomSheetExpanded: boolean;
}

const UploadShareView = ({hasShared, isBottomSheetExpanded}: {hasShared?: boolean; isBottomSheetExpanded: boolean}) => {
  return hasShared ? (
    <DiagnosedShareView isBottomSheetExpanded={isBottomSheetExpanded} />
  ) : (
    <DiagnosedShareUploadView isBottomSheetExpanded={isBottomSheetExpanded} />
  );
};

const ContentExposureStatus = ({isBottomSheetExpanded}: ContentProps) => {
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();
  const regionCase = getRegionCase(region, regionalI18n.activeRegions);
  const exposureStatus = useExposureStatus();
  const [, turnNotificationsOn] = useNotificationPermissionStatus();
  useEffect(() => {
    return turnNotificationsOn();
  }, [turnNotificationsOn]);

  const getNoExposureView = (_regionCase: RegionCase) => {
    switch (_regionCase) {
      case 'noRegionSet':
        return <NoExposureNoRegionView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case 'regionActive':
        return <NoExposureCoveredRegionView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case 'regionNotActive':
        return <NoExposureUncoveredRegionView isBottomSheetExpanded={isBottomSheetExpanded} />;
    }
  };

  // this is for the test menu
  const {forceScreen} = useStorage();
  if (TEST_MODE) {
    switch (forceScreen) {
      case ForceScreen.NoExposureView:
        return getNoExposureView(regionCase);
      case ForceScreen.ExposureView:
        return <ExposureView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case ForceScreen.DiagnosedShareView:
        return <DiagnosedShareView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case ForceScreen.DiagnosedView:
        return <DiagnosedView isBottomSheetExpanded={isBottomSheetExpanded} />;
      case ForceScreen.DiagnosedShareUploadView:
        return <DiagnosedShareUploadView isBottomSheetExpanded={isBottomSheetExpanded} />;
      default:
        break;
    }
  }

  switch (exposureStatus.type) {
    case ExposureStatusType.Exposed:
      return <ExposureView isBottomSheetExpanded={isBottomSheetExpanded} />;
    case ExposureStatusType.Diagnosed:
      return exposureStatus.needsSubmission ? (
        <UploadShareView isBottomSheetExpanded={isBottomSheetExpanded} hasShared={exposureStatus.hasShared} />
      ) : (
        <DiagnosedView isBottomSheetExpanded={isBottomSheetExpanded} />
      );
    case ExposureStatusType.Monitoring:
      return getNoExposureView(regionCase);
  }
};

const ContentSystemStatus = () => {
  const {userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const network = useNetInfo();

  // this is for the test menu
  const {forceScreen} = useStorage();
  if (TEST_MODE) {
    switch (forceScreen) {
      case ForceScreen.FrameworkUnavailableView:
        return <FrameworkUnavailableView />;
      default:
        break;
    }
  }

  if (userStopped && systemStatus !== SystemStatus.Active) {
    return <ExposureNotificationsUserStoppedView />;
  }

  switch (systemStatus) {
    case SystemStatus.Undefined:
    case SystemStatus.Unauthorized:
      return <ExposureNotificationsUnauthorizedView />;
    case SystemStatus.Disabled:
    case SystemStatus.Restricted:
      return <ExposureNotificationsDisabledView />;
    case SystemStatus.PlayServicesNotAvailable:
      return <FrameworkUnavailableView />;
  }

  if (!network.isConnected) {
    return <NetworkDisabledView />;
  }
  switch (systemStatus) {
    case SystemStatus.BluetoothOff:
      return <BluetoothDisabledView />;
    case SystemStatus.LocationOff:
      return <LocationOffView />;
    case SystemStatus.Active:
      return <></>;
    default:
      return <UnknownProblemView />;
  }
};

const CollapsedContent = (bottomSheetBehavior: BottomSheetBehavior) => {
  const [systemStatus] = useSystemStatus();
  const [notificationStatus, turnNotificationsOn] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';

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
  const {userStopped} = useStorage();
  useEffect(() => {
    if (__DEV__ && TEST_MODE) {
      DevSettings.addMenuItem('Show Demo Menu', () => {
        navigation.navigate('TestScreen');
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
  const updateExposureStatus = useUpdateExposureStatus();

  const startAndUpdate = useCallback(async () => {
    if (userStopped) return;
    const success = await startExposureNotificationService();
    if (success) {
      updateExposureStatus();
    }
  }, [userStopped, updateExposureStatus, startExposureNotificationService]);

  useEffect(() => {
    startAndUpdate();
  }, [startAndUpdate, startExposureNotificationService, updateExposureStatus]);

  const bottomSheetRef = useRef<BottomSheetBehavior>(null);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const currentStatus = useExposureStatus().type;
  const previousStatus = usePrevious(currentStatus);
  useLayoutEffect(() => {
    if (previousStatus === ExposureStatusType.Monitoring && currentStatus === ExposureStatusType.Diagnosed) {
      bottomSheetRef.current?.collapse();
    }
  }, [currentStatus, previousStatus]);
  useLayoutEffect(() => {
    bottomSheetRef.current?.setOnStateChange(setIsBottomSheetExpanded);
  }, []);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(
    () =>
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: 1000,
        duration: 10,
        useNativeDriver: false,
      }).start(),
    [fadeAnim],
  );

  return (
    <NotificationPermissionStatusProvider>
      <Box flex={1} alignItems="center" backgroundColor="mainBackground">
        <Box
          flex={1}
          paddingTop="m"
          paddingBottom="m"
          alignSelf="stretch"
          accessibilityElementsHidden={isBottomSheetExpanded}
          importantForAccessibility={isBottomSheetExpanded ? 'no-hide-descendants' : undefined}
        >
          <Animated.View style={{opacity: fadeAnim}}>
            <BaseHomeView>
              <ContentExposureStatus isBottomSheetExpanded={isBottomSheetExpanded} />
              <ContentSystemStatus />
            </BaseHomeView>
          </Animated.View>
        </Box>
        <BottomSheet ref={bottomSheetRef} expandedComponent={ExpandedContent} collapsedComponent={CollapsedContent} />
      </Box>
    </NotificationPermissionStatusProvider>
  );
};
