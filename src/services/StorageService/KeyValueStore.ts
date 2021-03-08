import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

export interface KeyValueStore {
  save(key: string, value: string): Promise<void>;
  retrieve(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}

export class UnsecureKeyValueStore implements KeyValueStore {
  save(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }

  retrieve(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  delete(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}

export class SecureKeyValueStore implements KeyValueStore {
  save(key: string, value: string): Promise<void> {
    return RNSecureKeyStore.set(key, value, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
  }

  retrieve(key: string): Promise<string | null> {
    return RNSecureKeyStore.get(key).catch(() => null);
  }

  delete(key: string): Promise<void> {
    return RNSecureKeyStore.remove(key);
  }
}
