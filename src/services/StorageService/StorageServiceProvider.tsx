import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {DevSettings} from 'react-native';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';
import {CheckInData, initialOutbreakStatus} from 'shared/qr';
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
  const [userStopped, setUserStoppedInternal] = useState(storageService.userStopped.get());

  const setUserStopped = useMemo(
    () => (newVal: boolean) => {
      storageService.setUserStopped(newVal);
    },
    [storageService],
  );

  const [locale, setLocaleInternal] = useState(storageService.locale.get());
  const setLocale = useMemo(
    () => (newLocale: string) => {
      storageService.setLocale(newLocale);
    },
    [storageService],
  );

  const [checkInHistory, addCheckInInternal] = useState(storageService.checkInHistory.get());
  const addCheckIn = useMemo(
    () => (newCheckIn: CheckInData) => {
      storageService.addCheckIn(newCheckIn);
    },
    [storageService],
  );

  const removeCheckIn = useMemo(
    () => () => {
      storageService.removeCheckIn();
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

  const [outbreakStatus, setOutbreakStatusInternal] = useState(storageService.outbreakStatus.get());
  const setOutbreakStatus = useMemo(() => storageService.setOutbreakStatus, [storageService.setOutbreakStatus]);

  useEffect(() => storageService.isOnboarding.observe(setIsOnboarding), [storageService.isOnboarding]);
  useEffect(() => storageService.locale.observe(setLocaleInternal), [storageService.locale]);
  useEffect(() => storageService.checkInHistory.observe(addCheckInInternal), [storageService.checkInHistory]);
  useEffect(() => storageService.region.observe(setRegionInternal), [storageService.region]);
  useEffect(() => storageService.onboardedDatetime.observe(setOnboardedDatetimeInternal), [
    storageService.onboardedDatetime,
  ]);
  useEffect(() => storageService.forceScreen.observe(setForceScreenInternal), [storageService.forceScreen]);
  useEffect(() => storageService.skipAllSet.observe(setSkipAllSetInternal), [storageService.skipAllSet]);
  useEffect(() => storageService.userStopped.observe(setUserStoppedInternal), [storageService.userStopped]);
  useEffect(() => storageService.outbreakStatus.observe(setOutbreakStatusInternal), [storageService.outbreakStatus]);

  const reset = useCallback(async () => {
    setOnboarded(false);
    setLocale(getSystemLocale());
    setRegion(undefined);
    setOnboardedDatetime(undefined);
    setSkipAllSet(false);
    setUserStopped(false);
    setOutbreakStatus(initialOutbreakStatus);
    await AsyncStorage.clear();
    if (__DEV__) {
      DevSettings.reload('Reset app');
    }
  }, [setLocale, setOnboarded, setOnboardedDatetime, setOutbreakStatus, setRegion, setSkipAllSet, setUserStopped]);

  return useMemo(
    () => ({
      isOnboarding,
      setOnboarded,
      locale,
      setLocale,
      checkInHistory,
      addCheckIn,
      removeCheckIn,
      region,
      setRegion,
      onboardedDatetime,
      setOnboardedDatetime,
      forceScreen,
      setForceScreen,
      skipAllSet,
      setSkipAllSet,
      reset,
      userStopped,
      setUserStopped,
      outbreakStatus,
      setOutbreakStatus,
    }),
    [
      isOnboarding,
      setOnboarded,
      locale,
      setLocale,
      checkInHistory,
      addCheckIn,
      removeCheckIn,
      region,
      setRegion,
      onboardedDatetime,
      setOnboardedDatetime,
      forceScreen,
      setForceScreen,
      skipAllSet,
      setSkipAllSet,
      reset,
      userStopped,
      setUserStopped,
      outbreakStatus,
      setOutbreakStatus,
    ],
  );
};
