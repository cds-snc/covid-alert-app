import AsyncStorage from '@react-native-community/async-storage';
import {Observable} from 'shared/Observable';
import {Region} from 'shared/Region';

enum Key {
  IsOnboarded = 'IsOnboarded',
  Locale = 'Locale',
  Region = 'Region',
}

export class StorageService {
  isOnboarding: Observable<boolean>;
  locale: Observable<string>;
  region: Observable<Region | undefined>;

  ready: Observable<boolean>;

  constructor() {
    this.isOnboarding = new Observable<boolean>(true);
    this.locale = new Observable<string>('en');
    this.ready = new Observable<boolean>(false);
    this.region = new Observable<Region | undefined>(undefined);
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

  private init = async () => {
    const isOnboarded = (await AsyncStorage.getItem(Key.IsOnboarded)) === '1';
    this.isOnboarding.set(!isOnboarded);

    const locale = (await AsyncStorage.getItem(Key.Locale)) || this.locale.value;
    this.locale.set(locale);

    const region = ((await AsyncStorage.getItem(Key.Region)) as Region | undefined) || undefined;
    this.region.set(region);

    this.ready.set(true);
  };
}
