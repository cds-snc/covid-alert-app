import AsyncStorage from '@react-native-async-storage/async-storage';
import {Observable} from 'shared/Observable';
import {ForceScreen} from 'shared/ForceScreen';
import {Region} from 'shared/Region';
import {getSystemLocale} from 'locale/utils';

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
export class StorageService {
  isOnboarding: Observable<boolean>;
  locale: Observable<string>;
  region: Observable<Region | undefined>;
  onboardedDatetime: Observable<Date | undefined>;
  forceScreen: Observable<ForceScreen | undefined>;
  skipAllSet: Observable<boolean>;
  userStopped: Observable<boolean>;
  hasViewedQrInstructions: Observable<boolean>;
  qrEnabled: Observable<boolean>;

  constructor() {
    this.isOnboarding = new Observable<boolean>(true);
    this.locale = new Observable<string>(getSystemLocale());
    this.region = new Observable<Region | undefined>(undefined);
    this.onboardedDatetime = new Observable<Date | undefined>(undefined);
    this.forceScreen = new Observable<ForceScreen | undefined>(undefined);
    this.skipAllSet = new Observable<boolean>(false);
    this.userStopped = new Observable<boolean>(false);
    this.hasViewedQrInstructions = new Observable<boolean>(false);
    this.qrEnabled = new Observable<boolean>(false);
  }

  setOnboarded = async (value: boolean) => {
    await AsyncStorage.setItem(Key.IsOnboarded, value ? '1' : '0');
    this.isOnboarding.set(!value);
  };

  setLocale = async (value: string) => {
    await AsyncStorage.setItem(Key.Locale, value);
    this.locale.set(value);
  };

  setRegion = async (value: Region | undefined) => {
    await AsyncStorage.setItem(Key.Region, value ? value : '');
    this.region.set(value);
  };

  setOnboardedDatetime = async (value: Date | undefined) => {
    await AsyncStorage.setItem(Key.OnboardedDatetime, value ? value.toISOString() : '');
    this.onboardedDatetime.set(value);
  };

  setForceScreen = async (value: ForceScreen | undefined) => {
    await AsyncStorage.setItem(Key.ForceScreen, value ? value : '');
    this.forceScreen.set(value);
  };

  setSkipAllSet = async (value: boolean) => {
    await AsyncStorage.setItem(Key.SkipAllSet, value ? '1' : '0');
    this.skipAllSet.set(value);
  };

  setUserStopped = async (value: boolean) => {
    await AsyncStorage.setItem(Key.UserStopped, value ? '1' : '0');
    this.userStopped.set(value);
  };

  setHasViewedQrInstructions = async (value: boolean) => {
    await AsyncStorage.setItem(Key.HasViewedQrInstructions, value ? '1' : '0');
    this.hasViewedQrInstructions.set(value);
  };

  setQrEnabled = async (value: boolean) => {
    await AsyncStorage.setItem(Key.QrEnabled, value ? '1' : '0');
    this.qrEnabled.set(value);
  };

  init = async () => {
    const isOnboarded = (await AsyncStorage.getItem(Key.IsOnboarded)) === '1';
    this.isOnboarding.set(!isOnboarded);

    const locale = (await AsyncStorage.getItem(Key.Locale)) || this.locale.get();
    this.locale.set(locale);

    const region = ((await AsyncStorage.getItem(Key.Region)) as Region | undefined) || undefined;
    this.region.set(region);

    const onboardedDatetimeStr =
      ((await AsyncStorage.getItem(Key.OnboardedDatetime)) as string | undefined) || undefined;
    const onboardedDatetime = onboardedDatetimeStr ? new Date(onboardedDatetimeStr) : undefined;
    this.onboardedDatetime.set(onboardedDatetime);

    const forceScreen = ((await AsyncStorage.getItem(Key.ForceScreen)) as ForceScreen | undefined) || undefined;
    this.forceScreen.set(forceScreen);

    const skipAllSet = (await AsyncStorage.getItem(Key.SkipAllSet)) === '1';
    this.skipAllSet.set(skipAllSet);

    const userStopped = (await AsyncStorage.getItem(Key.UserStopped)) === '1';
    this.userStopped.set(userStopped);

    const hasViewedQrInstructions = (await AsyncStorage.getItem(Key.HasViewedQrInstructions)) === '1';
    this.hasViewedQrInstructions.set(hasViewedQrInstructions);

    const qrEnabled = (await AsyncStorage.getItem(Key.QrEnabled)) === '1';
    this.qrEnabled.set(qrEnabled);
  };
}

export const createStorageService = async () => {
  const storageService = new StorageService();
  await storageService.init();
  return storageService;
};
