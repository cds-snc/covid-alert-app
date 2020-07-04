/**
 * @format
 */
import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-community/async-storage';
import SecureStorage from 'react-native-sensitive-info';
import ExposureNotification from 'bridge/ExposureNotification';
import {HMAC_KEY, RETRIEVE_URL, SENTRY_DSN, SUBMIT_URL} from 'env';
import {AppRegistry, YellowBox} from 'react-native';
import {BackendService} from 'services/BackendService';
import {BackgroundScheduler} from 'services/BackgroundSchedulerService';
import {ExposureNotificationService} from 'services/ExposureNotificationService';
import {getBackgroundI18n} from 'locale';
import * as Sentry from '@sentry/react-native';
import {CaptureConsole} from '@sentry/integrations';
import DeviceInfo from 'react-native-device-info';

import {name as appName} from '../app.json';

import {useStorageService} from './services/StorageService';
import App from './App';

AppRegistry.registerComponent(appName, () => App);

BackgroundScheduler.registerAndroidHeadlessPeriodicTask(async () => {
  const storageService = useStorageService();
  const backendService = new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region);
  const i18n = await getBackgroundI18n();
  const exposureNotificationService = new ExposureNotificationService(
    backendService,
    i18n,
    AsyncStorage,
    SecureStorage,
    ExposureNotification,
  );
  await exposureNotificationService.init();
  await exposureNotificationService.updateExposureStatusInBackground();
});

if (__DEV__) {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      enableAutoSessionTracking: true,
      // Sessions close after app is 10 seconds in the background.
      sessionTrackingIntervalMillis: 10000,
      integrations: [new CaptureConsole()],
    });
    Sentry.setUser({uniqueId: DeviceInfo.getUniqueId()});
  } catch (error) {
    console.error('Unable to init senty', error);
  }

  YellowBox.ignoreWarnings([
    // Triggered by a lot of third party modules and not really actionable.
    'Require cycle:',
    // From 'react-native-snap-carousel', see https://github.com/archriss/react-native-snap-carousel/issues/672.
    'Calling `getNode()` on the ref of an Animated component is no longer necessary',
    // From 'react-native-zip-archive'.
    'Sending `zipArchiveProgressEvent` with no listeners registered.',
  ]);
}
