import AsyncStorage from '@react-native-community/async-storage';
import {CaptureConsole} from '@sentry/integrations';
import * as Sentry from '@sentry/react-native';
import {getRandomString} from 'bridge/CovidShield';
import {SENTRY_DSN} from 'env';
import DeviceInfo from 'react-native-device-info';

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
  console.error('Unable to init Sentry', error);
}

const UUID_KEY = 'UUID_KEY';

const cachedUUID = AsyncStorage.getItem(UUID_KEY)
  .then(uuid => uuid || getRandomString(8))
  .then(uuid => {
    AsyncStorage.setItem(UUID_KEY, uuid);
    return uuid;
  })
  .catch(() => null);

let currentUUID = '';

export const setLogUUID = (uuid: string) => {
  currentUUID = uuid;
  AsyncStorage.setItem(UUID_KEY, uuid);
};

export const getLogUUID = async () => {
  return currentUUID || (await cachedUUID) || 'unset';
};

export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  const uuid = await getLogUUID();
  const scope = new Sentry.Scope();
  scope.setExtras(params);
  const finalMessage = `[${uuid}] ${message}`.replace(/\n/g, '');
  Sentry.captureMessage(finalMessage, scope);
};

export const captureException = async (message: string, error: any, params: {[key in string]: any} = {}) => {
  const uuid = await getLogUUID();
  const scope = new Sentry.Scope();
  scope.setExtras({
    ...params,
    error: {
      message: error && error.message,
      error,
    },
  });
  const finalMessage = `[${uuid}] Error: ${message}`.replace(/\n/g, '');
  Sentry.captureMessage(finalMessage, scope);
};
