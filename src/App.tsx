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
import DevPersistedNavigationContainer from 'navigation/DevPersistedNavigationContainer';
import {I18nContext, I18nManager} from '@shopify/react-i18n';
import MainNavigator from 'navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StorageServiceProvider, useStorage} from 'services/StorageService';
import Reactotron from 'reactotron-react-native';
import {NativeModules, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {TestMode} from 'testMode';
import {TEST_MODE, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY, REGION} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {SharedTranslations} from 'locale';
import {ThemeProvider} from 'shared/theme';

// grabs the ip address
if (__DEV__) {
  const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];
  Reactotron.configure({host})
    .useReactNative()
    .connect();
}

const App = () => {
  useEffect(() => SplashScreen.hide(), []);

  const {locale} = useStorage();
  const i18nManager = useMemo(
    () =>
      new I18nManager({
        locale,
        onError(error) {
          console.log('>>> i18N', error);
        },
      }),
    [locale],
  );

  const backendService = useMemo(() => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, REGION), []);

  return (
    <I18nContext.Provider value={i18nManager}>
      <SharedTranslations>
        <ExposureNotificationServiceProvider backendInterface={backendService}>
          <DevPersistedNavigationContainer persistKey="navigationState">
            {TEST_MODE ? (
              <TestMode>
                <MainNavigator />
              </TestMode>
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
