import AsyncStorage from '@react-native-community/async-storage';
import {Observable} from 'shared/Observable';

enum Key {
  IsOnboarded = 'IsOnboarded',
  Locale = 'Locale',
}

export class StorageService {
  isOnboarding: Observable<boolean>;
  locale: Observable<string>;

  ready: Observable<boolean>;

  constructor() {
    this.isOnboarding = new Observable<boolean>(true);
    this.locale = new Observable<string>('en');
    this.ready = new Observable<boolean>(false);
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

  private init = async () => {
    const isOnboarded = (await AsyncStorage.getItem(Key.IsOnboarded)) === '1';
    this.isOnboarding.set(!isOnboarded);

    const locale = (await AsyncStorage.getItem(Key.Locale)) || this.locale.value;
    this.locale.set(locale);

    this.ready.set(true);
  };
}
