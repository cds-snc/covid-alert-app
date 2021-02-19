import React, {useCallback, useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {Box} from 'components';
import {DevSettings} from 'react-native';
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
import {ForceScreen} from 'shared/ForceScreen';
import {useRegionalI18n} from 'locale';
import {OutbreakStatusType} from 'shared/qr';
import {useOutbreakService} from 'shared/OutbreakProvider';

import {useDeepLinks} from '../qr/utils';

import {BluetoothDisabledView} from './views/BluetoothDisabledView';
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
import {FrameworkUnavailableView} from './views/FrameworkUnavailableView';
import {ExposureNotificationsUserStoppedView} from './views/ExposureNotificationsUserStoppedView';
import {UnknownProblemView} from './views/UnknownProblemView';
import {
  useNotificationPermissionStatus,
  NotificationPermissionStatusProvider,
} from './components/NotificationPermissionStatus';
import {LocationOffView} from './views/LocationOffView';
import {OutbreakExposedView} from './views/OutbreakExposedView';
import {MenuBar} from './views/MenuBar';

const UploadShareView = ({hasShared}: {hasShared?: boolean}) => {
  return hasShared ? <DiagnosedShareView /> : <DiagnosedShareUploadView />;
};

const Content = () => {
  const {region, userStopped} = useStorage();

  const regionalI18n = useRegionalI18n();
  const regionCase = getRegionCase(region, regionalI18n.activeRegions);
  const exposureStatus = useExposureStatus();
  const [systemStatus] = useSystemStatus();
  const {outbreakStatus} = useOutbreakService();
  const [, turnNotificationsOn] = useNotificationPermissionStatus();
  useEffect(() => {
    return turnNotificationsOn();
  }, [turnNotificationsOn]);

  const network = useNetInfo();

  const getNoExposureView = (_regionCase: RegionCase) => {
    switch (_regionCase) {
      case 'noRegionSet':
        return <NoExposureNoRegionView />;
      case 'regionActive':
        return <NoExposureCoveredRegionView />;
      case 'regionNotActive':
        return <NoExposureUncoveredRegionView />;
    }
  };

  // this is for the test menu
  const {forceScreen} = useStorage();
  if (TEST_MODE) {
    switch (forceScreen) {
      case ForceScreen.NoExposureView:
        return getNoExposureView(regionCase);
      case ForceScreen.ExposureView:
        return <ExposureView />;
      case ForceScreen.DiagnosedShareView:
        return <DiagnosedShareView />;
      case ForceScreen.DiagnosedView:
        return <DiagnosedView />;
      case ForceScreen.DiagnosedShareUploadView:
        return <DiagnosedShareUploadView />;
      case ForceScreen.FrameworkUnavailableView:
        return <FrameworkUnavailableView />;
      default:
        break;
    }
  }

  if (outbreakStatus.type === OutbreakStatusType.Exposed) {
    return <OutbreakExposedView />;
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

  switch (exposureStatus.type) {
    case ExposureStatusType.Exposed:
      return <ExposureView />;
    case ExposureStatusType.Diagnosed:
      if (!network.isConnected) {
        return <NetworkDisabledView />;
      }

      /* @todo UploadShareView pass hasShared from ExposureStatus */
      return exposureStatus.needsSubmission ? (
        <UploadShareView hasShared={exposureStatus.hasShared} />
      ) : (
        <DiagnosedView />
      );
    case ExposureStatusType.Monitoring:
    default:
      if (!network.isConnected) {
        return <NetworkDisabledView />;
      }
      switch (systemStatus) {
        case SystemStatus.BluetoothOff:
          return <BluetoothDisabledView />;
        case SystemStatus.LocationOff:
          return <LocationOffView />;
        case SystemStatus.Active:
          return getNoExposureView(regionCase);
        default:
          return <UnknownProblemView />;
      }
  }
};

export const HomeScreen = () => {
  const {checkForOutbreaks} = useOutbreakService();
  const navigation = useNavigation();
  const {userStopped, qrEnabled} = useStorage();

  useEffect(() => {
    if (__DEV__ && TEST_MODE) {
      DevSettings.addMenuItem('Show Demo Menu', () => {
        navigation.navigate('TestScreen');
      });
    }
  }, [navigation]);

  useDeepLinks();

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
    if (qrEnabled) {
      checkForOutbreaks();
    }
    if (success) {
      updateExposureStatus();
    }
  }, [userStopped, startExposureNotificationService, qrEnabled, checkForOutbreaks, updateExposureStatus]);

  useEffect(() => {
    startAndUpdate();
  }, [startAndUpdate, startExposureNotificationService, updateExposureStatus]);

  return (
    <NotificationPermissionStatusProvider>
      <Box flex={1} alignItems="center" backgroundColor="mainBackground">
        <Box flex={1} paddingTop="m" paddingBottom="m" alignSelf="stretch">
          <Content />
        </Box>
        <MenuBar />
      </Box>
    </NotificationPermissionStatusProvider>
  );
};
