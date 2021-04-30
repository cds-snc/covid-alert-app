import {Observable} from 'shared/Observable';
import {ForceScreen} from 'shared/ForceScreen';
import {Region} from 'shared/Region';
import {getSystemLocale} from 'locale/utils';
import {StorageService, DefaultStorageService, StorageDirectory} from 'services/StorageService';

export enum Key {
  IsOnboarded = 'IsOnboarded',
  Locale = 'Locale',
  Region = 'Region',
  OnboardedDatetime = 'OnboardedDatetime',
  ForceScreen = 'ForceScreen',
  SkipAllSet = 'SkipAllSet',
  UserStopped = 'UserStopped',
  CheckInHistory = 'CheckInHistory',
  OutbreakHistory = 'OutbreakHistory',
  HasViewedQrInstructions = 'HasViewedQRInstructions',
  QrEnabled = 'QrEnabled',
}

export class CachedStorageService {
  isOnboarding: Observable<boolean>;
  locale: Observable<string>;
  region: Observable<Region | undefined>;
  onboardedDatetime: Observable<Date | undefined>;
  forceScreen: Observable<ForceScreen | undefined>;
  skipAllSet: Observable<boolean>;
  userStopped: Observable<boolean>;
  hasViewedQrInstructions: Observable<boolean>;
  qrEnabled: Observable<boolean>;

  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.isOnboarding = new Observable<boolean>(true);
    this.locale = new Observable<string>(getSystemLocale());
    this.region = new Observable<Region | undefined>(undefined);
    this.onboardedDatetime = new Observable<Date | undefined>(undefined);
    this.forceScreen = new Observable<ForceScreen | undefined>(undefined);
    this.skipAllSet = new Observable<boolean>(false);
    this.userStopped = new Observable<boolean>(false);
    this.hasViewedQrInstructions = new Observable<boolean>(false);
    this.qrEnabled = new Observable<boolean>(false);
    this.storageService = storageService;
  }

  setOnboarded = async (value: boolean) => {
    await this.storageService.save(StorageDirectory.CachedStorageServiceIsOnboardedKey, value ? '1' : '0');
    this.isOnboarding.set(!value);
  };

  setLocale = async (value: string) => {
    await this.storageService.save(StorageDirectory.GlobalLocaleKey, value);
    this.locale.set(value);
  };

  setRegion = async (value: Region | undefined) => {
    await this.storageService.save(StorageDirectory.GlobalRegionKey, value ? value : '');
    this.region.set(value);
  };

  setOnboardedDatetime = async (value: Date | undefined) => {
    await this.storageService.save(StorageDirectory.GlobalOnboardedDatetimeKey, value ? value.toISOString() : '');
    this.onboardedDatetime.set(value);
  };

  setForceScreen = async (value: ForceScreen | undefined) => {
    await this.storageService.save(StorageDirectory.CachedStorageServiceForceScreenKey, value ? value : '');
    this.forceScreen.set(value);
  };

  setSkipAllSet = async (value: boolean) => {
    await this.storageService.save(StorageDirectory.CachedStorageServiceSkipAllSetKey, value ? '1' : '0');
    this.skipAllSet.set(value);
  };

  setUserStopped = async (value: boolean) => {
    await this.storageService.save(StorageDirectory.CachedStorageServiceUserStoppedKey, value ? '1' : '0');
    this.userStopped.set(value);
  };

  setHasViewedQrInstructions = async (value: boolean) => {
    await this.storageService.save(StorageDirectory.CachedStorageServiceHasViewedQRInstructionsKey, value ? '1' : '0');
    this.hasViewedQrInstructions.set(value);
  };

  setQrEnabled = async (value: boolean) => {
    await this.storageService.save(StorageDirectory.GlobalQrEnabledKey, value ? '1' : '0');
    this.qrEnabled.set(value);
  };

  init = async () => {
    const isOnboarded =
      (await this.storageService.retrieve(StorageDirectory.CachedStorageServiceIsOnboardedKey)) === '1';
    this.isOnboarding.set(!isOnboarded);

    const locale = (await this.storageService.retrieve(StorageDirectory.GlobalLocaleKey)) || this.locale.get();
    this.locale.set(locale);

    const region =
      ((await this.storageService.retrieve(StorageDirectory.GlobalRegionKey)) as Region | undefined) || undefined;
    this.region.set(region);

    const onboardedDatetimeStr =
      ((await this.storageService.retrieve(StorageDirectory.GlobalOnboardedDatetimeKey)) as string | undefined) ||
      undefined;
    const onboardedDatetime = onboardedDatetimeStr ? new Date(onboardedDatetimeStr) : undefined;
    this.onboardedDatetime.set(onboardedDatetime);

    const forceScreen =
      ((await this.storageService.retrieve(StorageDirectory.CachedStorageServiceForceScreenKey)) as
        | ForceScreen
        | undefined) || undefined;
    this.forceScreen.set(forceScreen);

    const skipAllSet = (await this.storageService.retrieve(StorageDirectory.CachedStorageServiceSkipAllSetKey)) === '1';
    this.skipAllSet.set(skipAllSet);

    const userStopped =
      (await this.storageService.retrieve(StorageDirectory.CachedStorageServiceUserStoppedKey)) === '1';
    this.userStopped.set(userStopped);

    const hasViewedQrInstructions =
      (await this.storageService.retrieve(StorageDirectory.CachedStorageServiceHasViewedQRInstructionsKey)) === '1';
    this.hasViewedQrInstructions.set(hasViewedQrInstructions);

    const qrEnabled = (await this.storageService.retrieve(StorageDirectory.GlobalQrEnabledKey)) === '1';
    this.qrEnabled.set(qrEnabled);
  };
}

export const createCachedStorageService = async (
  storageService: StorageService = DefaultStorageService.sharedInstance(),
) => {
  const cachedStorageService = new CachedStorageService(storageService);
  await cachedStorageService.init();
  return cachedStorageService;
};
