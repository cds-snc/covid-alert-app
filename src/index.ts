/**
 * @format
 */
import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-community/async-storage';
import SecureStorage from 'react-native-sensitive-info';
import ExposureNotification from 'bridge/ExposureNotification';
import {HMAC_KEY, RETRIEVE_URL, SUBMIT_URL} from 'env';
import {AppRegistry} from 'react-native';
import {BackendService} from 'services/BackendService';
import {BackgroundScheduler} from 'services/BackgroundSchedulerService';
import {ExposureNotificationService} from 'services/ExposureNotificationService';
import {getBackgroundI18n} from 'locale';

import {name as appName} from '../app.json';

import App from './App';

AppRegistry.registerComponent(appName, () => App);

BackgroundScheduler.registerAndroidHeadlessPeriodicTask(async () => {
  const backendService = new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY);
  const i18n = await getBackgroundI18n();
  const exposureNotificationService = new ExposureNotificationService(
    backendService,
    i18n.translate,
    AsyncStorage,
    SecureStorage,
    ExposureNotification,
  );
  await exposureNotificationService.updateExposureStatusInBackground();
});

// TODO: fix this later
console.disableYellowBox = true;
