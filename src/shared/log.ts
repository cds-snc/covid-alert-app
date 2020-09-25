import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';

const PLATFORM = Platform.OS;
const UUID_KEY = 'UUID_KEY';

const getRandomString = (size: number) => {
  const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];

  return [...Array(size)].map(_ => chars[(Math.random() * chars.length) | 0]).join('');
};

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

const isTest = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  //
  const uuid = await getLogUUID();
  const finalMessage = `[${uuid}] - ${PLATFORM} ${message}`.replace(/\n/g, '');
  const finalParams = params;

  if (__DEV__ && !isTest()) {
    console.log(finalMessage, finalParams); // eslint-disable-line no-console
  }
};

export const captureException = async (message: string, error: any, params: {[key in string]: any} = {}) => {
  const uuid = await getLogUUID();
  const finalMessage = `[${uuid}] - ${PLATFORM} Error: ${message}`.replace(/\n/g, '');

  const finalParams = {
    ...params,
    error: {
      message: error && error.message,
      error,
    },
  };

  if (__DEV__ && !isTest()) {
    console.log(finalMessage, finalParams); // eslint-disable-line no-console
  }
};
