import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {I18nContext} from '@shopify/react-i18n';
import {getSystemLocale} from 'locale';
import {DevSettings} from 'react-native';

import {StorageService} from './StorageService';

const StorageServiceContext = createContext<StorageService | undefined>(undefined);

export interface StorageServiceProviderProps {
  children?: React.ReactElement;
}

export const StorageServiceProvider = ({children}: StorageServiceProviderProps) => {
  const storageService = useMemo(() => new StorageService(), []);
  const [ready, setReady] = useState(false);

  useEffect(() => storageService.ready.observe(setReady), [storageService]);

  return <StorageServiceContext.Provider value={storageService}>{ready && children}</StorageServiceContext.Provider>;
};

export const useStorage = () => {
  const storageService = useContext(StorageServiceContext)!;
  const i18nManager = React.useContext(I18nContext);

  const [isOnboarding, setIsOnboarding] = useState(storageService.isOnboarding.value);
  const setOnboarded = useMemo(() => storageService.setOnboarded, [storageService.setOnboarded]);

  const [locale, setLocaleInternal] = useState(storageService.locale.value);
  const setLocale = useMemo(
    () => (newLocale: string) => {
      storageService.setLocale(newLocale);
      if (i18nManager && newLocale && newLocale !== i18nManager.details.locale) i18nManager.update({locale: newLocale});
    },
    [storageService, i18nManager],
  );

  const [region, setRegionInternal] = useState(storageService.region.value);
  const setRegion = useMemo(() => storageService.setRegion, [storageService.setRegion]);

  const [onboardedDatetime, setOnboardedDatetimeInternal] = useState(storageService.onboardedDatetime.value);
  const setOnboardedDatetime = useMemo(() => storageService.setOnboardedDatetime, [
    storageService.setOnboardedDatetime,
  ]);

  const [forceScreen, setForceScreenInternal] = useState(storageService.forceScreen.value);
  const setForceScreen = useMemo(() => storageService.setForceScreen, [storageService.setForceScreen]);

  const [skipAllSet, setSkipAllSetInternal] = useState(storageService.skipAllSet.value);
  const setSkipAllSet = useMemo(() => storageService.setSkipAllSet, [storageService.setSkipAllSet]);

  useEffect(() => storageService.isOnboarding.observe(setIsOnboarding), [storageService.isOnboarding]);
  useEffect(() => storageService.locale.observe(setLocaleInternal), [storageService.locale]);
  useEffect(() => storageService.region.observe(setRegionInternal), [storageService.region]);
  useEffect(() => storageService.onboardedDatetime.observe(setOnboardedDatetimeInternal), [
    storageService.onboardedDatetime,
  ]);
  useEffect(() => storageService.forceScreen.observe(setForceScreenInternal), [storageService.forceScreen]);
  useEffect(() => storageService.skipAllSet.observe(setSkipAllSetInternal), [storageService.skipAllSet]);

  const reset = useCallback(async () => {
    setOnboarded(false);
    setLocale(getSystemLocale());
    setRegion(undefined);
    setOnboardedDatetime(undefined);
    setSkipAllSet(false);
    await AsyncStorage.clear();
    if (__DEV__) {
      DevSettings.reload('Reset app');
    }
  }, [setLocale, setOnboarded, setOnboardedDatetime, setRegion, setSkipAllSet]);

  return useMemo(
    () => ({
      isOnboarding,
      setOnboarded,
      locale,
      setLocale,
      region,
      setRegion,
      onboardedDatetime,
      setOnboardedDatetime,
      forceScreen,
      setForceScreen,
      skipAllSet,
      setSkipAllSet,
      reset,
    }),
    [
      forceScreen,
      isOnboarding,
      locale,
      onboardedDatetime,
      region,
      skipAllSet,
      reset,
      setForceScreen,
      setLocale,
      setOnboarded,
      setOnboardedDatetime,
      setRegion,
      setSkipAllSet,
    ],
  );
};
