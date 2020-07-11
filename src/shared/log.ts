import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getRandomString} from 'bridge/CovidShield';

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
  const finalMessage = `[${uuid}] ${message}`;
  const finalPrams = params;

  const scope = new Sentry.Scope();
  scope.setExtras(finalPrams);

  localLog(finalMessage, params);
  Sentry.captureMessage(finalMessage, scope);
};

export const captureException = async (error: any, params: {[key in string]: any} = {}) => {
  const uuid = await getLogUUID();
  const finalMessage = `[${uuid}] Error`;
  const finalPrams = {
    ...params,
    error: {
      message: error && error.message,
      error,
    },
  };

  const scope = new Sentry.Scope();
  scope.setExtras(finalPrams);

  localLog(`[${uuid}] Error`);
  Sentry.captureMessage(finalMessage, scope);
};

export const localLog = async (message: string, params: {[key in string]: any} = {}) => {
  const url = `http://192.168.0.24:3001/${encodeURI(message)}/${encodeURI(JSON.stringify(params))}`;
  await fetch(url).catch(() => {});
};
