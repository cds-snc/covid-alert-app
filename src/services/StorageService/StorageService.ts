import AsyncStorage from '@react-native-community/async-storage';
import {Observable} from 'shared/Observable';
import {Region} from 'shared/Region';
import {getSystemLocale} from 'locale';

export enum Key {
  IsOnboarded = 'IsOnboarded',
  Locale = 'Locale',
  Region = 'Region',
  OnboardedDatetime = 'OnboardedDatetime',
  ForceScreen = 'ForceScreen',
  SkipAllSet = 'SkipAllSet',
}

export class StorageService {
  isOnboarding: Observable<boolean>;
  locale: Observable<string>;
  region: Observable<Region | undefined>;
  onboardedDatetime: Observable<Date | undefined>;
  forceScreen: Observable<string | undefined>;
  skipAllSet: Observable<boolean>;

  ready: Observable<boolean>;

  constructor() {
    this.isOnboarding = new Observable<boolean>(true);
    this.locale = new Observable<string>(getSystemLocale());
    this.ready = new Observable<boolean>(false);
    this.region = new Observable<Region | undefined>(undefined);
    this.onboardedDatetime = new Observable<Date | undefined>(undefined);
    this.forceScreen = new Observable<string | undefined>(undefined);
    this.skipAllSet = new Observable<boolean>(false);
    this.init();
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

  setForceScreen = async (value: string | undefined) => {
    await AsyncStorage.setItem(Key.ForceScreen, value ? value : '');
    this.forceScreen.set(value);
  };

  setSkipAllSet = async (value: boolean) => {
    await AsyncStorage.setItem(Key.SkipAllSet, value ? '1' : '0');
    this.skipAllSet.set(value);
  };

  private init = async () => {
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

    const forceScreen = ((await AsyncStorage.getItem(Key.ForceScreen)) as string | undefined) || undefined;
    this.forceScreen.set(forceScreen);

    const skipAllSet = (await AsyncStorage.getItem(Key.SkipAllSet)) === '1';
    this.skipAllSet.set(skipAllSet);

    this.ready.set(true);
  };
}
