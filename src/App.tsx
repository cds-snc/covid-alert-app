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
import {AppState, AppStateStatus, Platform, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {SUBMIT_URL, RETRIEVE_URL, HMAC_KEY} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {I18nProvider, RegionalProvider} from 'locale';
import {ThemeProvider} from 'shared/theme';
import {AccessibilityServiceProvider} from 'services/AccessibilityService';
import {captureMessage} from 'shared/log';

import regionContentDefault from './locale/translations/region.json';
import {RegionContent, RegionContentResponse} from './shared/Region';

// this allows us to use new Date().toLocaleString() for date formatting on android
// https://github.com/facebook/react-native/issues/19410#issuecomment-482804142
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-CA');
  require('intl/locale-data/jsonp/fr-CA');
  require('date-time-format-timezone');
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

    const fetchData = async () => {
      const regionContent: RegionContentResponse = await backendService.getRegionContent();
      if (regionContent.status === 200) {
        setRegionContent({payload: regionContent.payload});
      }
      return true;
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
              <MainNavigator />
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
