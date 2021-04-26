import {NativeModules, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

const AndroidStorageModule = NativeModules.Storage as {
  save(keyIdentifier: string, inSecureStorage: boolean, value: string): Promise<void>;
  retrieve(keyIdentifier: string, inSecureStorage: boolean): Promise<string | null>;
  delete(keyIdentifier: string, inSecureStorage: boolean): Promise<void>;
  deleteAll(): Promise<void>;
};

export interface KeyValueStore {
  save(key: string, value: string): Promise<void>;
  retrieve(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  deleteAll(): Promise<void>;
}

export class UnsecureKeyValueStore implements KeyValueStore {
  save(key: string, value: string): Promise<void> {
    if (isRunningOnAndroid()) return AndroidStorageModule.save(key, false, value);
    else return AsyncStorage.setItem(key, value);
  }

  retrieve(key: string): Promise<string | null> {
    if (isRunningOnAndroid()) return AndroidStorageModule.retrieve(key, false);
    else return AsyncStorage.getItem(key);
  }

  delete(key: string): Promise<void> {
    if (isRunningOnAndroid()) return AndroidStorageModule.delete(key, false);
    else return AsyncStorage.removeItem(key);
  }

  deleteAll(): Promise<void> {
    if (isRunningOnAndroid()) return AndroidStorageModule.deleteAll();
    else return AsyncStorage.clear();
  }
}

export class SecureKeyValueStore implements KeyValueStore {
  save(key: string, value: string): Promise<void> {
    if (isRunningOnAndroid()) return AndroidStorageModule.save(key, true, value);
    // FYI: The accessible parameter is only working on the iOS platform
    else return RNSecureKeyStore.set(key, value, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
  }

  retrieve(key: string): Promise<string | null> {
    if (isRunningOnAndroid()) return AndroidStorageModule.retrieve(key, true);
    else return RNSecureKeyStore.get(key).catch(() => null);
  }

  delete(key: string): Promise<void> {
    if (isRunningOnAndroid()) return AndroidStorageModule.delete(key, true);
    else return RNSecureKeyStore.remove(key);
  }

  deleteAll(): Promise<void> {
    throw new Error('Not implemented because of missing API on RNSecureKeyStore');
  }
}

function isRunningOnAndroid(): boolean {
  return Platform.OS === 'android';
}
