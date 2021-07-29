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
  useStopExposureNotificationService,
  useExposureNotificationSystemStatusAutomaticUpdater,
  useSystemStatus,
  useCancelPeriodicTask,
} from 'services/ExposureNotificationService';
import {useCachedStorage} from 'services/StorageService';
import {RegionCase} from 'shared/Region';
import {getRegionCase} from 'shared/RegionLogic';
import {ForceScreen} from 'shared/ForceScreen';
import {useRegionalI18n} from 'locale';
import {getNonIgnoredOutbreakHistory, isExposedToOutbreak} from 'shared/qr';
import {useOutbreakService, isDiagnosed} from 'services/OutbreakService';
import {useNotificationPermissionStatus} from 'shared/NotificationPermissionStatus';

import {useDeepLinks} from '../qr/utils';
import {MenuBar} from '../menu/views/MenuBar';

import {BluetoothDisabledView} from './views/BluetoothDisabledView';
import {DiagnosedShareView} from './views/DiagnosedShareView';
import {DiagnosedView} from './views/DiagnosedView';
import {DiagnosedShareUploadView} from './views/DiagnosedShareUploadView';
import {ExposureNotificationsDisabledView} from './views/ExposureNotificationsDisabledView';
import {ExposureNotificationsUnauthorizedView} from './views/ExposureNotificationsUnauthorizedView';
import {ProximityExposureView} from './views/ProximityExposureView';
import {NoExposureUncoveredRegionView} from './views/NoExposureUncoveredRegionView';
import {NoExposureCoveredRegionView} from './views/NoExposureCoveredRegionView';
import {NoExposureNoRegionView} from './views/NoExposureNoRegionView';
import {NetworkDisabledView} from './views/NetworkDisabledView';
import {FrameworkUnavailableView} from './views/FrameworkUnavailableView';
import {ExposureNotificationsUserStoppedView} from './views/ExposureNotificationsUserStoppedView';
import {UnknownProblemView} from './views/UnknownProblemView';
import {LocationOffView} from './views/LocationOffView';
import {OutbreakExposedView} from './views/OutbreakExposedView';
import {ImportantMessageView} from './views/ImportantMessageView';

const UploadShareView = ({hasShared}: {hasShared?: boolean}) => {
  return hasShared ? <DiagnosedShareView /> : <DiagnosedShareUploadView />;
};

const Content = () => {
  const {region, userStopped, qrEnabled} = useCachedStorage();

  const regionalI18n = useRegionalI18n();
  const regionCase = getRegionCase(region, regionalI18n.activeRegions);
  const exposureStatus = useExposureStatus();
  const [systemStatus] = useSystemStatus();
  const {outbreakHistory} = useOutbreakService();
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
  const {forceScreen} = useCachedStorage();
  if (TEST_MODE) {
    switch (forceScreen) {
      case ForceScreen.NoExposureView:
        return getNoExposureView(regionCase);
      case ForceScreen.ExposureView:
        return <ProximityExposureView />;
      case ForceScreen.DiagnosedShareView:
        return <DiagnosedShareView />;
      case ForceScreen.DiagnosedView:
        return <DiagnosedView />;
      case ForceScreen.DiagnosedShareUploadView:
        return <DiagnosedShareUploadView />;
      case ForceScreen.FrameworkUnavailableView:
        return <FrameworkUnavailableView />;
      case ForceScreen.OutbreakExposedView:
        return <OutbreakExposedView />;
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

  if (qrEnabled && isExposedToOutbreak(outbreakHistory)) {
    if (exposureStatus.type === ExposureStatusType.Monitoring) {
      return <OutbreakExposedView />;
    } else if (exposureStatus.type === ExposureStatusType.Exposed) {
      const currentOutbreakHistory = getNonIgnoredOutbreakHistory(outbreakHistory);
      const outbreakTimestamp = currentOutbreakHistory[currentOutbreakHistory.length - 1].checkInTimestamp;
      const proximityTimestamp = exposureStatus.summary.lastExposureTimestamp;
      if (outbreakTimestamp > proximityTimestamp) {
        return <OutbreakExposedView />;
      }
    }
  }

  switch (exposureStatus.type) {
    case ExposureStatusType.Exposed:
      return <ProximityExposureView />;
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
  const {userStopped, qrEnabled} = useCachedStorage();
  const exposureStatus = useExposureStatus();

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

  const {importantMessage} = useCachedStorage();

  const startExposureNotificationService = useStartExposureNotificationService();
  const stopExposureNotificationService = useStopExposureNotificationService();
  const updateExposureStatus = useUpdateExposureStatus();
  const cancelPeriodicTask = useCancelPeriodicTask();

  const startAndUpdate = useCallback(async () => {
    console.log(`userStopped: ${userStopped}`);
    if (userStopped) return;
    console.log('startAndUpdate');
    if (importantMessage) {
      console.log('stopping EN');
      stopExposureNotificationService(false);
      cancelPeriodicTask();
      return;
    }
    const success = await startExposureNotificationService(false);
    if (qrEnabled && !isDiagnosed(exposureStatus.type)) {
      checkForOutbreaks();
    }
    if (success) {
      updateExposureStatus();
    }
  }, [
    userStopped,
    startExposureNotificationService,
    stopExposureNotificationService,
    qrEnabled,
    checkForOutbreaks,
    updateExposureStatus,
    exposureStatus.type,
    importantMessage,
  ]);

  useEffect(() => {
    startAndUpdate();
  }, [startAndUpdate, startExposureNotificationService, updateExposureStatus]);

  return (
    <Box flex={1} alignItems="center" backgroundColor="mainBackground">
      <Box flex={1} paddingTop="m" alignSelf="stretch">
        {importantMessage ? <ImportantMessageView /> : <Content />}
      </Box>
      {!importantMessage && <MenuBar />}
    </Box>
  );
};
