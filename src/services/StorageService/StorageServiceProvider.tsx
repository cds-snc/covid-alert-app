import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

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

  useEffect(() => storageService.isOnboarding.observe(setIsOnboarding), [storageService.isOnboarding]);
  useEffect(() => storageService.locale.observe(setLocaleInternal), [storageService.locale]);

  const reset = useCallback(() => {
    setOnboarded(false);
    setLocale('en');
    AsyncStorage.clear();
  }, [setLocale, setOnboarded]);

  return useMemo(
    () => ({
      isOnboarding,
      setOnboarded,
      locale,
      setLocale,
      reset,
    }),
    [isOnboarding, locale, reset, setLocale, setOnboarded],
  );
};
