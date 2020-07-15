import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {DevSettings} from 'react-native';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';
import {getSystemLocale} from 'locale/utils';

import {StorageService, createStorageService} from './StorageService';

const StorageServiceContext = createContext<StorageService | undefined>(undefined);

export interface StorageServiceProviderProps {
  children?: React.ReactElement;
}

export const StorageServiceProvider = ({children}: StorageServiceProviderProps) => {
  const [storageService, setStorageService] = useState<StorageService>();

  useEffect(() => {
    const {callable, cancelable} = createCancellableCallbackPromise(() => createStorageService(), setStorageService);
    callable();
    return cancelable;
  }, []);

  return (
    <StorageServiceContext.Provider value={storageService}>{storageService && children}</StorageServiceContext.Provider>
  );
};

export const useStorageService = () => {
  return useContext(StorageServiceContext)!!;
};

export const useStorage = () => {
  const storageService = useContext(StorageServiceContext)!;

  const [isOnboarding, setIsOnboarding] = useState(storageService.isOnboarding.get());
  const setOnboarded = useMemo(() => storageService.setOnboarded, [storageService.setOnboarded]);

  const [locale, setLocaleInternal] = useState(storageService.locale.get());
  const setLocale = useMemo(
    () => (newLocale: string) => {
      storageService.setLocale(newLocale);
    },
    [storageService],
  );

  const [region, setRegionInternal] = useState(storageService.region.get());
  const setRegion = useMemo(() => storageService.setRegion, [storageService.setRegion]);

  const [onboardedDatetime, setOnboardedDatetimeInternal] = useState(storageService.onboardedDatetime.get());
  const setOnboardedDatetime = useMemo(() => storageService.setOnboardedDatetime, [
    storageService.setOnboardedDatetime,
  ]);

  const [forceScreen, setForceScreenInternal] = useState(storageService.forceScreen.get());
  const setForceScreen = useMemo(() => storageService.setForceScreen, [storageService.setForceScreen]);

  const [skipAllSet, setSkipAllSetInternal] = useState(storageService.skipAllSet.get());
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
