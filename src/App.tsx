/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useMemo, useEffect, useState} from 'react';
import DevPersistedNavigationContainer from 'navigation/DevPersistedNavigationContainer';
import MainNavigator from 'navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StorageServiceProvider, useStorageService} from 'services/StorageService';
import Reactotron from 'reactotron-react-native';
import {AppState, AppStateStatus, NativeModules, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {DemoMode} from 'testMode';
import {TEST_MODE, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {I18nProvider, RegionalProvider} from 'locale';
import {ThemeProvider} from 'shared/theme';
import {AccessibilityServiceProvider} from 'services/AccessibilityService';
import {captureMessage, captureException} from 'shared/log';
import AsyncStorage from '@react-native-community/async-storage';
import regionSchema from 'locale/translations/regionSchema.json';
import JsonSchemaValidator from 'shared/JsonSchemaValidator';

import regionContentDefault from './locale/translations/region.json';
import {RegionContent, RegionContentResponse} from './shared/Region';

const REGION_CONTENT_KEY = 'regionContentKey';
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
  const initialRegionContent: RegionContent = regionContentDefault as RegionContent;
  const storageService = useStorageService();
  const backendService = useMemo(() => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, storageService?.region), [
    storageService,
  ]);

  const [regionContent, setRegionContent] = useState<IFetchData>({payload: initialRegionContent});

  useEffect(() => {
    const onAppStateChange = async (newState: AppStateStatus) => {
      captureMessage('onAppStateChange', {appState: newState});
      if (newState === 'active') {
        captureMessage('app is active - fetch data', {appState: newState});
        await fetchData();
      }
    };

    const loadStoredRegionContent = async () => {
      const storedRegionContent = await AsyncStorage.getItem(REGION_CONTENT_KEY);
      if (storedRegionContent) {
        const storedRegionContentJson = JSON.parse(storedRegionContent);
        try {
          new JsonSchemaValidator().validateJson(storedRegionContentJson, regionSchema);
          captureMessage('initData() loaded stored content.');
          setRegionContent({payload: storedRegionContentJson});
        } catch (error) {
          captureException(error.message, error);
        }
      } else {
        captureMessage('initData() no stored content.');
      }
    };

    const fetchData = async () => {
      try {
        await loadStoredRegionContent();
        const downloadedRegionContent: RegionContentResponse = await backendService.getRegionContent();
        if (downloadedRegionContent.status === 200) {
          new JsonSchemaValidator().validateJson(downloadedRegionContent.payload, regionSchema);
          setRegionContent({payload: downloadedRegionContent.payload});
        }
      } catch (error) {
        captureException(error.message, error);
      }
    };

    fetchData()
      .then(async () => {
        await appInit();
      })
      .catch(() => {});

    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [backendService, initialRegionContent]);

  return (
    <I18nProvider>
      <RegionalProvider activeRegions={[]} translate={id => id} regionContent={regionContent.payload}>
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
