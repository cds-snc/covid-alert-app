import {DefaultFutureStorageService, StorageDirectory} from 'services/StorageService';

let currentUUID = '';

const getRandomString = (size: number) => {
  const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];

  return [...Array(size)].map(_ => chars[(Math.random() * chars.length) | 0]).join('');
};

const cachedUUID = DefaultFutureStorageService.sharedInstance()
  .retrieve(StorageDirectory.UUIDKey)
  .then(uuid => uuid || getRandomString(8))
  .then(uuid => {
    DefaultFutureStorageService.sharedInstance().save(StorageDirectory.UUIDKey, uuid);
    return uuid;
  })
  .catch(() => null);

export const setLogUUID = (uuid: string) => {
  currentUUID = uuid;
  DefaultFutureStorageService.sharedInstance().save(StorageDirectory.UUIDKey, uuid);
};

export const getLogUUID = async () => {
  return currentUUID || (await cachedUUID) || 'unset';
};
