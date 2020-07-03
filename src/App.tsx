/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useMemo, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import DevPersistedNavigationContainer from 'navigation/DevPersistedNavigationContainer';
import {I18nContext, I18nManager} from '@shopify/react-i18n';
import MainNavigator from 'navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StorageServiceProvider, Key, useStorageService} from 'services/StorageService';
import Reactotron from 'reactotron-react-native';
import {NativeModules, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {DemoMode} from 'testMode';
import {TEST_MODE, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {SharedTranslations, getSystemLocale} from 'locale';
import {ThemeProvider} from 'shared/theme';

// grabs the ip address
if (__DEV__) {
  const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];
  Reactotron.configure({host})
    .useReactNative()
    .connect();
}

const i18nManager = new I18nManager({
  locale: getSystemLocale(),
  onError(error) {
    console.log('>>> i18N', error);
  },
});

const appInit = async () => {
  try {
    const locale = await AsyncStorage.getItem(Key.Locale);
    if (locale && locale !== i18nManager.details.locale) i18nManager.update({locale});
  } catch (error) {
    console.error(error);
  }

  // only hide splash screen after our init is done
  SplashScreen.hide();
};

const App = () => {
  useEffect(() => {
    appInit();
  }, []);

  const storageService = useStorageService();
  const backendService = useMemo(
    () => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region),
    [],
  );

  return (
    <I18nContext.Provider value={i18nManager}>
      <SharedTranslations>
        <ExposureNotificationServiceProvider backendInterface={backendService}>
          <DevPersistedNavigationContainer persistKey="navigationState">
            {TEST_MODE ? (
              <DemoMode>
                <MainNavigator />
              </DemoMode>
            ) : (
              <MainNavigator />
            )}
          </DevPersistedNavigationContainer>
        </ExposureNotificationServiceProvider>
      </SharedTranslations>
    </I18nContext.Provider>
  );
};

const AppProvider = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="transparent" translucent />
      <StorageServiceProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StorageServiceProvider>
    </SafeAreaProvider>
  );
};

export default AppProvider;
