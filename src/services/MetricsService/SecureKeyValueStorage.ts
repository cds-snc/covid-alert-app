import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

export interface SecureKeyValueStore {
  save(key: string, value: string): Promise<void>;
  retrieve(key: string): Promise<string | null>;
}

export class DefaultSecureKeyValueStore implements SecureKeyValueStore {
  save(key: string, value: string): Promise<void> {
    return RNSecureKeyStore.set(key, value, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
  }

  retrieve(key: string): Promise<string | null> {
    return RNSecureKeyStore.get(key).catch(() => null);
  }
}
