/**
 * @format
 */
import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureKeyStore from 'react-native-secure-key-store';
import ExposureNotification from 'bridge/ExposureNotification';
import {HMAC_KEY, RETRIEVE_URL, SUBMIT_URL} from 'env';
import {AppRegistry, LogBox, Platform} from 'react-native';
import {BackendService} from 'services/BackendService';
import {BackgroundScheduler} from 'services/BackgroundSchedulerService';
import {ExposureNotificationService} from 'services/ExposureNotificationService';
import {createBackgroundI18n} from 'locale';
import {FilteredMetricsService, EventTypeMetric} from 'services/MetricsService';
import {publishDebugMetric} from 'bridge/DebugMetrics';

import {createStorageService} from './services/StorageService';
import App from './App';

AppRegistry.registerComponent('CovidShield', () => App);

if (Platform.OS === 'android') {
  BackgroundScheduler.registerAndroidHeadlessPeriodicTask(async () => {
    await FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ActiveUser});

    const storageService = await createStorageService();
    const backendService = new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region);
    const i18n = await createBackgroundI18n();
    const exposureNotificationService = new ExposureNotificationService(
      backendService,
      i18n,
      AsyncStorage,
      RNSecureKeyStore,
      ExposureNotification,
      FilteredMetricsService.sharedInstance(),
    );

    await exposureNotificationService.updateExposureStatusInBackground();
  });

  BackgroundScheduler.registerAndroidHeadlessExposureCheckPeriodicTask(async () => {
    publishDebugMetric(4.3);
    await FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ActiveUser});

    const storageService = await createStorageService();
    const backendService = new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region);
    const i18n = await createBackgroundI18n();
    const exposureNotificationService = new ExposureNotificationService(
      backendService,
      i18n,
      AsyncStorage,
      RNSecureKeyStore,
      ExposureNotification,
      FilteredMetricsService.sharedInstance(),
    );
    if (await exposureNotificationService.shouldPerformExposureCheck()) {
      await exposureNotificationService.initiateExposureCheckHeadless();
    }
  });
}

if (__DEV__) {
  LogBox.ignoreLogs([
    // Triggered by a lot of third party modules and not really actionable.
    'Require cycle:',
    // From 'react-native-snap-carousel', see https://github.com/archriss/react-native-snap-carousel/issues/672.
    'Calling `getNode()` on the ref of an Animated component is no longer necessary',
    // From 'react-native-zip-archive'.
    'Sending `zipArchiveProgressEvent` with no listeners registered.',
  ]);
}
