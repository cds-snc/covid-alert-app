import AsyncStorage from '@react-native-async-storage/async-storage';

const UUID_KEY = 'UUID_KEY';
let currentUUID = '';

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

export const setLogUUID = (uuid: string) => {
  currentUUID = uuid;
  AsyncStorage.setItem(UUID_KEY, uuid);
};

export const getLogUUID = async () => {
  return currentUUID || (await cachedUUID) || 'unset';
};
