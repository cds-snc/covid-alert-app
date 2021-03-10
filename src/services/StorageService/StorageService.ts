import PQueue from 'p-queue';

import {KeyValueStore, SecureKeyValueStore, UnsecureKeyValueStore} from './KeyValueStore';

export enum StorageType {
  Unsecure,
  Secure,
}

export interface KeyDefinition {
  keyIdentifier: string;
  storageType: StorageType;
}

export interface StorageService {
  save(keyDefinition: KeyDefinition, value: string): Promise<void>;
  retrieve(keyDefinition: KeyDefinition): Promise<string | null>;
  delete(keyDefinition: KeyDefinition): Promise<void>;
  // Deletes all data from unsecure store only
  deteleAll(): Promise<void>;
}

export class DefaultStorageService implements StorageService {
  private static instance: StorageService;

  static sharedInstance(): StorageService {
    if (!this.instance) {
      this.instance = new this(new UnsecureKeyValueStore(), new SecureKeyValueStore());
    }
    return this.instance;
  }

  private unsecureKeyValueStore: KeyValueStore;
  private secureKeyValueStore: KeyValueStore;

  private serialPromiseQueue: PQueue;

  constructor(unsecureKeyValueStore: KeyValueStore, secureKeyValueStore: KeyValueStore) {
    this.unsecureKeyValueStore = unsecureKeyValueStore;
    this.secureKeyValueStore = secureKeyValueStore;
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  save(keyDefinition: KeyDefinition, value: string): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      switch (keyDefinition.storageType) {
        case StorageType.Unsecure:
          return this.unsecureKeyValueStore.save(keyDefinition.keyIdentifier, value);
        case StorageType.Secure:
          return this.secureKeyValueStore.save(keyDefinition.keyIdentifier, value);
      }
    });
  }

  retrieve(keyDefinition: KeyDefinition): Promise<string | null> {
    return this.serialPromiseQueue.add(() => {
      switch (keyDefinition.storageType) {
        case StorageType.Unsecure:
          return this.unsecureKeyValueStore.retrieve(keyDefinition.keyIdentifier);
        case StorageType.Secure:
          return this.secureKeyValueStore.retrieve(keyDefinition.keyIdentifier);
      }
    });
  }

  delete(keyDefinition: KeyDefinition): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      switch (keyDefinition.storageType) {
        case StorageType.Unsecure:
          return this.unsecureKeyValueStore.delete(keyDefinition.keyIdentifier);
        case StorageType.Secure:
          return this.secureKeyValueStore.delete(keyDefinition.keyIdentifier);
      }
    });
  }

  deteleAll(): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      return this.unsecureKeyValueStore.deleteAll();
    });
  }
}
