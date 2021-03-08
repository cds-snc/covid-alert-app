import {KeyDefinition, StorageType} from './FutureStorageService';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StorageDirectory {
  static readonly MyTestKey: KeyDefinition = {
    keyIdentifier: 'customIdentifier',
    storageType: StorageType.Secure,
  };
}
