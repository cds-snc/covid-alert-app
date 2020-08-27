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
import MainNavigator from 'navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StorageServiceProvider, useStorageService} from 'services/StorageService';
import Reactotron from 'reactotron-react-native';
import {NativeModules, StatusBar, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {DemoMode} from 'testMode';
import {TEST_MODE, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {I18nProvider} from 'locale';
import {ThemeProvider} from 'shared/theme';
import {AccessibilityServiceProvider} from 'services/AccessibilityService';
import {captureMessage} from 'shared/log';

// this allows us to use new Date().toLocaleString() for date formatting on android
// https://github.com/facebook/react-native/issues/19410#issuecomment-482804142
if (Platform === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-CA');
  require('intl/locale-data/jsonp/fr-CA');
  require('date-time-format-timezone');
}

// grabs the ip address
if (__DEV__) {
  const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];
  Reactotron.configure({host})
    .useReactNative()
    .connect();
}

const appInit = async () => {
  captureMessage('App.appInit()');
  // only hide splash screen after our init is done
  SplashScreen.hide();
};

const App = () => {
  useEffect(() => {
    appInit();
  }, []);

  const storageService = useStorageService();
  const backendService = useMemo(() => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region), [
    storageService,
  ]);

  return (
    <I18nProvider>
      <ExposureNotificationServiceProvider backendInterface={backendService}>
        <DevPersistedNavigationContainer persistKey="navigationState">
          <AccessibilityServiceProvider>
            {TEST_MODE ? (
              <DemoMode>
                <MainNavigator />
              </DemoMode>
            ) : (
              <MainNavigator />
            )}
          </AccessibilityServiceProvider>
        </DevPersistedNavigationContainer>
      </ExposureNotificationServiceProvider>
    </I18nProvider>
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
