import AsyncStorage from '@react-native-community/async-storage';

import {StorageService, Key, createStorageService} from './StorageService';

jest.mock('react-native-localize', () => ({
  getLocales: () => [{countryCode: 'US', languageTag: 'en-US', langaugeCode: 'en', isRTL: false}],
}));

describe('StorageService', () => {
  let storageService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    storageService = await createStorageService();
  });

  describe('createStorageService', () => {
    it('initializes onboarding status from persistent storage', async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(Key.IsOnboarded);
    });

    it('initializes locale from persistent storage', async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(Key.Locale);
    });

    it('initalizes region from persistent storage', async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(Key.Region);
    });

    it('initializes onboardedDateTime from persistent storage', async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(Key.OnboardedDatetime);
    });

    it('initializes forceScreen from persistent storage', async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(Key.ForceScreen);
    });

    it('initializes skipAllSet from persistent storage', async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(Key.SkipAllSet);
    });
  });

  describe('setOnboarded', () => {
    it('stores the onboarded status to permanent storage', async () => {
      await storageService.setOnboarded(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.IsOnboarded, '1');

      await storageService.setOnboarded(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.IsOnboarded, '0');
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
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.Locale, 'en');

      await storageService.setLocale('fr_CA');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.Locale, 'fr_CA');
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
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.Region, 'ABC');

      await storageService.setRegion('asd');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.Region, 'asd');
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
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.OnboardedDatetime, d1.toISOString());

      const d2 = new Date();
      await storageService.setOnboardedDatetime(d2);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.OnboardedDatetime, d2.toISOString());
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
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.ForceScreen, 'testing');

      await storageService.setForceScreen('xaz');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.ForceScreen, 'xaz');
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
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.SkipAllSet, '1');

      await storageService.setSkipAllSet(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(Key.SkipAllSet, '0');
    });

    it('exposes set value as StorageService attribute', async () => {
      await storageService.setSkipAllSet(false);
      expect(storageService.skipAllSet.get()).toStrictEqual(false);

      await storageService.setSkipAllSet(true);
      expect(storageService.skipAllSet.get()).toStrictEqual(true);
    });
  });
});
