/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import crypto from 'crypto';

import React, {useMemo, useEffect, useState} from 'react';
import DevPersistedNavigationContainer from 'navigation/DevPersistedNavigationContainer';
import MainNavigator from 'navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StorageServiceProvider, useStorageService} from 'services/StorageService';
import Reactotron from 'reactotron-react-native';
import {NativeModules, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {DemoMode} from 'testMode';
import {TEST_MODE, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {I18nProvider, RegionalProvider} from 'locale';
import {ThemeProvider} from 'shared/theme';
import {AccessibilityServiceProvider} from 'services/AccessibilityService';
import {captureMessage, captureException} from 'shared/log';

import {RegionContent} from './shared/Region';

// grabs the ip address
if (__DEV__) {
  const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];
  Reactotron.configure({host})
    .useReactNative()
    .connect();
}
interface IFetchData {
  payload: any;
}

const appInit = async () => {
  captureMessage('App.appInit()');
  SplashScreen.hide();
};

const App = () => {
  const initialRegionContent: RegionContent = {Active: 'None', en: '', fr: ''};

  const storageService = useStorageService();
  const backendService = useMemo(
    () => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region),
    [],
  );
  const [regionContent, setRegionContent] = useState<IFetchData>({payload: initialRegionContent});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const downloadedContent: RegionContent = await backendService.getRegionContent();
        captureMessage('server content ready');
        const initialRegionContentHash = crypto
          .createHash('md5')
          .update(JSON.stringify(initialRegionContent))
          .digest('hex');
        const newRegionContentHash = crypto
          .createHash('md5')
          .update(JSON.stringify(downloadedContent))
          .digest('hex');
        if (initialRegionContentHash !== newRegionContentHash) {
          setRegionContent({payload: downloadedContent});
        }
        appInit();
      } catch (error) {
        appInit();
        captureException(error.message, error);
      }
    };

    fetchData();
  }, [backendService, initialRegionContent]);

  return (
    <I18nProvider>
      <RegionalProvider regionContent={regionContent.payload}>
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
      </RegionalProvider>
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
