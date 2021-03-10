import {CachedStorageService, createCachedStorageService} from '../CachedStorageService';
import {FutureStorageService, StorageDirectory} from '../index';

jest.mock('react-native-localize', () => ({
  getLocales: () => [{countryCode: 'US', languageTag: 'en-US', langaugeCode: 'en', isRTL: false}],
}));

const futureStorageService: FutureStorageService = {
  save: jest.fn(),
  retrieve: jest.fn(),
  delete: jest.fn(),
};

describe('StorageService', () => {
  let storageService: CachedStorageService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    storageService = await createCachedStorageService(futureStorageService);
  });

  describe('createStorageService', () => {
    it('initializes onboarding status from persistent storage', async () => {
      expect(futureStorageService.retrieve).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceIsOnboardedKey);
    });

    it('initializes locale from persistent storage', async () => {
      expect(futureStorageService.retrieve).toHaveBeenCalledWith(StorageDirectory.GlobalLocaleKey);
    });

    it('initalizes region from persistent storage', async () => {
      expect(futureStorageService.retrieve).toHaveBeenCalledWith(StorageDirectory.GlobalRegionKey);
    });

    it('initializes onboardedDateTime from persistent storage', async () => {
      expect(futureStorageService.retrieve).toHaveBeenCalledWith(StorageDirectory.GlobalOnboardedDatetimeKey);
    });

    it('initializes forceScreen from persistent storage', async () => {
      expect(futureStorageService.retrieve).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceForceScreenKey);
    });

    it('initializes skipAllSet from persistent storage', async () => {
      expect(futureStorageService.retrieve).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceSkipAllSetKey);
    });
  });

  describe('setOnboarded', () => {
    it('stores the onboarded status to permanent storage', async () => {
      await storageService.setOnboarded(true);
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceIsOnboardedKey, '1');

      await storageService.setOnboarded(false);
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceIsOnboardedKey, '0');
    });

    it('exposes set value as StorageService attribute', async () => {
      await storageService.setOnboarded(true);
      expect(storageService.isOnboarding.get()).toStrictEqual(false);

      await storageService.setOnboarded(false);
      expect(storageService.isOnboarding.get()).toStrictEqual(true);
    });
  });

  describe('setLocale', () => {
    it('stores the locale to permanent storage', async () => {
      await storageService.setLocale('en');
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.GlobalLocaleKey, 'en');

      await storageService.setLocale('fr_CA');
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.GlobalLocaleKey, 'fr_CA');
    });

    it('exposes set value as StorageService attribute', async () => {
      await storageService.setLocale('en_US');
      expect(storageService.locale.get()).toStrictEqual('en_US');

      await storageService.setLocale('fr');
      expect(storageService.locale.get()).toStrictEqual('fr');
    });
  });

  describe('setRegion', () => {
    it('stores the region to permanent storage', async () => {
      await storageService.setRegion('ABC');
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.GlobalRegionKey, 'ABC');

      await storageService.setRegion('asd');
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.GlobalRegionKey, 'asd');
    });

    it('exposes set value as StorageService attribute', async () => {
      await storageService.setRegion('qwe');
      expect(storageService.region.get()).toStrictEqual('qwe');

      await storageService.setRegion('fddd');
      expect(storageService.region.get()).toStrictEqual('fddd');
    });
  });

  describe('setOnboardedDatetime', () => {
    it('stores the onboarded date to permanent storage', async () => {
      const d1 = new Date();
      await storageService.setOnboardedDatetime(d1);
      expect(futureStorageService.save).toHaveBeenCalledWith(
        StorageDirectory.GlobalOnboardedDatetimeKey,
        d1.toISOString(),
      );

      const d2 = new Date();
      await storageService.setOnboardedDatetime(d2);
      expect(futureStorageService.save).toHaveBeenCalledWith(
        StorageDirectory.GlobalOnboardedDatetimeKey,
        d2.toISOString(),
      );
    });

    it('exposes set value as StorageService attribute', async () => {
      const d1 = new Date();
      await storageService.setOnboardedDatetime(d1);
      expect(storageService.onboardedDatetime.get()).toStrictEqual(d1);

      const d2 = new Date();
      await storageService.setOnboardedDatetime(d2);
      expect(storageService.onboardedDatetime.get()).toStrictEqual(d2);
    });
  });

  describe('setForceScreen', () => {
    it('stores the forceScreen flag to permanent storage', async () => {
      await storageService.setForceScreen('testing');
      expect(futureStorageService.save).toHaveBeenCalledWith(
        StorageDirectory.CachedStorageServiceForceScreenKey,
        'testing',
      );

      await storageService.setForceScreen('xaz');
      expect(futureStorageService.save).toHaveBeenCalledWith(
        StorageDirectory.CachedStorageServiceForceScreenKey,
        'xaz',
      );
    });

    it('exposes set value as StorageService attribute', async () => {
      await storageService.setForceScreen('testing');
      expect(storageService.forceScreen.get()).toStrictEqual('testing');

      await storageService.setForceScreen('xaz');
      expect(storageService.forceScreen.get()).toStrictEqual('xaz');
    });
  });

  describe('setSkipAllSet', () => {
    it('stores the SkipAllSet flag to permanent storage', async () => {
      await storageService.setSkipAllSet(true);
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceSkipAllSetKey, '1');

      await storageService.setSkipAllSet(false);
      expect(futureStorageService.save).toHaveBeenCalledWith(StorageDirectory.CachedStorageServiceSkipAllSetKey, '0');
    });

    it('exposes set value as StorageService attribute', async () => {
      await storageService.setSkipAllSet(false);
      expect(storageService.skipAllSet.get()).toStrictEqual(false);

      await storageService.setSkipAllSet(true);
      expect(storageService.skipAllSet.get()).toStrictEqual(true);
    });
  });
});
