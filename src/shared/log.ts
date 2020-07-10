import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-community/async-storage';

const UUID_KEY = 'UUID_KEY';

const cachedUUID = AsyncStorage.getItem(UUID_KEY).catch(() => null);
let currentUUID = '';

export const setLogUUID = (uuid: string) => {
  currentUUID = uuid;
  AsyncStorage.setItem(UUID_KEY, uuid);
};

export const getLogUUID = async () => {
  return currentUUID || (await cachedUUID) || 'unset';
};

export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  const scope = new Sentry.Scope();
  scope.setExtras({...params, UUID: await getLogUUID()});
  Sentry.captureMessage(message, scope);
};

export const captureException = async (exception: any, params: {[key in string]: any} = {}) => {
  const scope = new Sentry.Scope();
  scope.setExtras({...params, UUID: await getLogUUID()});
  Sentry.captureException(exception, scope);
};
