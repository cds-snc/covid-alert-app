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
import {DefaultStorageService, CachedStorageServiceProvider, useCachedStorage} from 'services/StorageService';
import {AppState, AppStateStatus, Platform, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {SUBMIT_URL, RETRIEVE_URL, HMAC_KEY, QR_ENABLED} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {I18nProvider, RegionalProvider} from 'locale';
import {ThemeProvider} from 'shared/theme';
import {AccessibilityServiceProvider} from 'services/AccessibilityService';
import {NotificationPermissionStatusProvider} from 'shared/NotificationPermissionStatus';

import regionContentDefault from './locale/translations/region.json';
import {RegionContent, RegionContentResponse} from './shared/Region';
import {OutbreakProvider} from './services/OutbreakService';

import {Aes, Sha, Hmac, Pbkdf2, Rsa} from '@trackforce/react-native-crypto';

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
  SplashScreen.hide();
};

const testCrypto = async () => {
  const iterations = 4096;
  const keyInBytes = 32;
  const message = 'data to encrypt';
  const key = await Pbkdf2.hash('a0', 'a1b4efst', iterations, keyInBytes, 'SHA1');
  console.log(`pbkdf2 key: ${key}`);

  const hmac256Hash = await Hmac.hmac256(message, key);
  console.log(`hmac256: ${hmac256Hash}`);

  const sha1hash = await Sha.sha1('test');
  console.log(`sha1: ${sha1hash}`);

  const rsaKeys = await Rsa.generateKeys(1024);
  console.log('1024 private:', rsaKeys.private);
  console.log('1024 public:', rsaKeys.public);

  const rsaEncryptedMessage = await Rsa.encrypt(message, rsaKeys.public);
  console.log('rsa Encrypt:', rsaEncryptedMessage);

  const rsaSignature = await Rsa.sign(rsaEncryptedMessage, rsaKeys.private, 'SHA256');
  console.log('rsa Signature:', rsaSignature);

  const validSignature = await Rsa.verify(rsaSignature, rsaEncryptedMessage, rsaKeys.public, 'SHA256');
  console.log('rsa signature verified:', validSignature);

  const rsaDecryptedMessage = await Rsa.decrypt(rsaEncryptedMessage, rsaKeys.private);
  console.log('rsa Decrypt:', rsaDecryptedMessage);
};

const App = () => {
  const initialRegionContent: RegionContent = regionContentDefault as RegionContent;
  const backendService = useMemo(
    () => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY, DefaultStorageService.sharedInstance()),
    [],
  );

  const [regionContent, setRegionContent] = useState<IFetchData>({payload: initialRegionContent});
  const {setQrEnabled} = useCachedStorage();

  useEffect(() => {
    if (QR_ENABLED) {
      setQrEnabled(true);
    }
  }, [setQrEnabled]);

  useEffect(() => {
    const onAppStateChange = async (newState: AppStateStatus) => {
      testCrypto();
      if (newState === 'active') {
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
          <OutbreakProvider backendService={backendService}>
            <DevPersistedNavigationContainer>
              <AccessibilityServiceProvider>
                <NotificationPermissionStatusProvider>
                  <MainNavigator />
                </NotificationPermissionStatusProvider>
              </AccessibilityServiceProvider>
            </DevPersistedNavigationContainer>
          </OutbreakProvider>
        </ExposureNotificationServiceProvider>
      </RegionalProvider>
    </I18nProvider>
  );
};

const AppProvider = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="transparent" translucent />
      <CachedStorageServiceProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CachedStorageServiceProvider>
    </SafeAreaProvider>
  );
};

export default AppProvider;
