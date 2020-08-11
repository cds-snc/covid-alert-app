import {CaptureConsole} from '@sentry/integrations';
import {SENTRY_DSN} from 'env';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getRandomString} from 'bridge/CovidShield';

let sentryEnabled = false;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
    integrations: [new CaptureConsole()],
  });

  sentryEnabled = true;
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
  let finalMessage = message;
  const finalParams = params;

  if (__DEV__) {
    console.log(finalMessage, finalParams); // eslint-disable-line no-console
  }

  if (sentryEnabled) {
    const uuid = await getLogUUID();
    const scope = new Sentry.Scope();
    scope.setExtras(params);
    finalMessage = `[${uuid}] ${message}`.replace(/\n/g, '');

    Sentry.captureMessage(finalMessage, scope);
  }
};

export const captureException = async (message: string, error: any, params: {[key in string]: any} = {}) => {
  let finalMessage = `Error: ${message}`;
  const finalParams = {
    ...params,
    error: {
      message: error && error.message,
      error,
    },
  };

  if (__DEV__) {
    console.log(finalMessage, finalParams); // eslint-disable-line no-console
  }

  if (sentryEnabled) {
    const uuid = await getLogUUID();
    const scope = new Sentry.Scope();
    scope.setExtras(finalParams);
    finalMessage = `[${uuid}] Error: ${message}`.replace(/\n/g, '');

    Sentry.captureMessage(finalMessage, scope);
  }
};
