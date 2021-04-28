import {StorageDirectory, StorageService} from 'services/StorageService';

export const getOutbreaksLastCheckedDateTime = async (storageService: StorageService) => {
  const value = await storageService.retrieve(StorageDirectory.OutbreakProviderOutbreaksLastCheckedStorageKey);
  return value ? new Date(Number(value)) : null;
};

export const markOutbreaksLastCheckedDateTime = (storageService: StorageService, date: Date) => {
  return storageService.save(StorageDirectory.OutbreakProviderOutbreaksLastCheckedStorageKey, `${date.getTime()}`);
};
