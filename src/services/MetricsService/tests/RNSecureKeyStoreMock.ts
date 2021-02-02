import {SecureKeyValueStore} from '../SecureKeyValueStorage';

export class RNSecureKeyStoreMock implements SecureKeyValueStore {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  retrieve(key: string): Promise<string | null> {
    const result = this.store.get(key);
    if (result) {
      return Promise.resolve(result);
    } else {
      return Promise.resolve(null);
    }
  }

  save(key: string, value: string): Promise<void> {
    this.store.set(key, value);
    return Promise.resolve();
  }
}
