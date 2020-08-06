import {Platform} from 'react-native';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo';

export const APP_ID = Platform.select({
  android: Config.APP_ID_ANDROID,
  ios: Config.APP_ID_IOS,
})!!;

export const APP_VERSION_CODE = parseInt(Config.APP_VERSION_CODE, 10);

export const APP_VERSION_NAME = Config.APP_VERSION_NAME;

export const SUBMIT_URL = Config.SUBMIT_URL;

export const RETRIEVE_URL = Config.RETRIEVE_URL;

export const HMAC_KEY = Config.HMAC_KEY;

export const MCC_CODE = parseInt(Config.MCC_CODE, 10) || 302;

export const TEST_MODE = Config.TEST_MODE === 'true' || false;

export const MOCK_SERVER = Config.MOCK_SERVER === 'true' || false;

NetInfo.configure({
  reachabilityUrl: 'https://retrieval.covid-notification.alpha.canada.ca/exposure-configuration/present',
  reachabilityTest: async response => response.status === 204,
  reachabilityLongTimeout: 60 * 1000,
  reachabilityShortTimeout: 5 * 1000,
  reachabilityRequestTimeout: 15 * 1000,
});
