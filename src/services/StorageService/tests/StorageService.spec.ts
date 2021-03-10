import {StorageService} from '../index';
import {KeyValueStore} from '../KeyValueStore';
import {DefaultStorageService, KeyDefinition, StorageType} from '../StorageService';

const unsecureKeyValueStore: KeyValueStore = {
  save: jest.fn(),
  retrieve: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
};

const secureKeyValueStore: KeyValueStore = {
  save: jest.fn(),
  retrieve: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
};

const unsecureKey: KeyDefinition = {
  keyIdentifier: 'myKey',
  storageType: StorageType.Unsecure,
};

const secureKey: KeyDefinition = {
  keyIdentifier: 'myKey',
  storageType: StorageType.Secure,
};

describe('StorageService', () => {
  let sut: StorageService;

  beforeEach(async () => {
    sut = new DefaultStorageService(unsecureKeyValueStore, secureKeyValueStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('saves value in unsecure storage if key definition has unsecure storage type', async () => {
    await sut.save(unsecureKey, 'myValue');
    expect(unsecureKeyValueStore.save).toHaveBeenCalledWith('myKey', 'myValue');
    expect(secureKeyValueStore.save).not.toHaveBeenCalled();
  });

  it('saves value in secure storage if key definition has secure storage type', async () => {
    await sut.save(secureKey, 'myValue');
    expect(secureKeyValueStore.save).toHaveBeenCalledWith('myKey', 'myValue');
    expect(unsecureKeyValueStore.save).not.toHaveBeenCalled();
  });

  it('retrieves value in unsecure storage if key definition has unsecure storage type', async () => {
    await sut.retrieve(unsecureKey);
    expect(unsecureKeyValueStore.retrieve).toHaveBeenCalledWith('myKey');
    expect(secureKeyValueStore.retrieve).not.toHaveBeenCalled();
  });

  it('retrieves value in secure storage if key definition has secure storage type', async () => {
    await sut.retrieve(secureKey);
    expect(secureKeyValueStore.retrieve).toHaveBeenCalledWith('myKey');
    expect(unsecureKeyValueStore.retrieve).not.toHaveBeenCalled();
  });

  it('deletes value in unsecure storage if key definition has unsecure storage type', async () => {
    await sut.delete(unsecureKey);
    expect(unsecureKeyValueStore.delete).toHaveBeenCalledWith('myKey');
    expect(secureKeyValueStore.delete).not.toHaveBeenCalled();
  });

  it('deletes value in secure storage if key definition has secure storage type', async () => {
    await sut.delete(secureKey);
    expect(secureKeyValueStore.delete).toHaveBeenCalledWith('myKey');
    expect(unsecureKeyValueStore.delete).not.toHaveBeenCalled();
  });

  it('deletes all values in unsecure storage', async () => {
    await sut.deteleAll();
    expect(unsecureKeyValueStore.deleteAll).toHaveBeenCalled();
  });
});
