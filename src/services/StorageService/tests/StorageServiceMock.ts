import {FutureStorageService, KeyDefinition} from '../FutureStorageService';

export class StorageServiceMock implements FutureStorageService {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  save(keyDefinition: KeyDefinition, value: string): Promise<void> {
    this.store.set(keyDefinition.keyIdentifier, value);
    return Promise.resolve();
  }

  retrieve(keyDefinition: KeyDefinition): Promise<string | null> {
    const result = this.store.get(keyDefinition.keyIdentifier);
    if (result) {
      return Promise.resolve(result);
    } else {
      return Promise.resolve(null);
    }
  }

  delete(keyDefinition: KeyDefinition): Promise<void> {
    this.store.delete(keyDefinition.keyIdentifier);
    return Promise.resolve();
  }
}
