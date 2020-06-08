import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
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

  const [isOnboarding, setIsOnboarding] = useState(storageService.isOnboarding.value);
  const setOnboarded = useMemo(() => storageService.setOnboarded, [storageService.setOnboarded]);

  const [locale, setLocaleInternal] = useState(storageService.locale.value);
  const setLocale = useMemo(() => storageService.setLocale, [storageService.setLocale]);

  const [region, setRegionInternal] = useState(storageService.region.value);
  const setRegion = useMemo(() => storageService.setRegion, [storageService.setRegion]);

  useEffect(() => storageService.isOnboarding.observe(setIsOnboarding), [storageService.isOnboarding]);
  useEffect(() => storageService.locale.observe(setLocaleInternal), [storageService.locale]);
  useEffect(() => storageService.region.observe(setRegionInternal), [storageService.region]);

  const reset = useCallback(async () => {
    setOnboarded(false);
    setLocale('en');
    setRegion(undefined);
    await AsyncStorage.clear();
    if (__DEV__) {
      DevSettings.reload('Reset app');
    }
  }, [setLocale, setOnboarded, setRegion]);

  return useMemo(
    () => ({
      isOnboarding,
      setOnboarded,
      locale,
      setLocale,
      region,
      setRegion,
      reset,
    }),
    [isOnboarding, locale, region, reset, setLocale, setOnboarded, setRegion],
  );
};
