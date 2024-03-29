import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {DevSettings} from 'react-native';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';
import {getSystemLocale} from 'locale/utils';

import {CachedStorageService, createCachedStorageService} from './CachedStorageService';
import {DefaultStorageService} from './StorageService';

const CachedStorageServiceContext = createContext<CachedStorageService | undefined>(undefined);

export interface CachedStorageServiceProviderProps {
  children?: React.ReactElement;
}

export const CachedStorageServiceProvider = ({children}: CachedStorageServiceProviderProps) => {
  const [storageService, setStorageService] = useState<CachedStorageService>();

  useEffect(() => {
    const {callable, cancelable} = createCancellableCallbackPromise(
      () => createCachedStorageService(),
      setStorageService,
    );
    callable();
    return cancelable;
  }, []);

  return (
    <CachedStorageServiceContext.Provider value={storageService}>
      {storageService && children}
    </CachedStorageServiceContext.Provider>
  );
};

export const useCachedStorage = () => {
  const storageService = useContext(CachedStorageServiceContext)!;

  const [isOnboarding, setIsOnboarding] = useState(storageService.isOnboarding.get());
  const setOnboarded = useMemo(() => storageService.setOnboarded, [storageService.setOnboarded]);
  const setDecommissioned = useMemo(() => storageService.setDecommissioned, [storageService.setDecommissioned]);
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

  const [hasViewedQrInstructions, setHasViewedQrInstructions] = useState(storageService.hasViewedQrInstructions.get());
  const setHasViewedQr = useMemo(() => storageService.setHasViewedQrInstructions, [
    storageService.setHasViewedQrInstructions,
  ]);

  const [qrEnabled, setQrEnabledInternal] = useState(storageService.qrEnabled.get());
  const setQrEnabled = useMemo(() => storageService.setQrEnabled, [storageService.setQrEnabled]);

  useEffect(() => storageService.isOnboarding.observe(setIsOnboarding), [storageService.isOnboarding]);
  useEffect(() => storageService.locale.observe(setLocaleInternal), [storageService.locale]);
  useEffect(() => storageService.region.observe(setRegionInternal), [storageService.region]);
  useEffect(() => storageService.onboardedDatetime.observe(setOnboardedDatetimeInternal), [
    storageService.onboardedDatetime,
  ]);
  useEffect(() => storageService.forceScreen.observe(setForceScreenInternal), [storageService.forceScreen]);
  useEffect(() => storageService.skipAllSet.observe(setSkipAllSetInternal), [storageService.skipAllSet]);
  useEffect(() => storageService.userStopped.observe(setUserStoppedInternal), [storageService.userStopped]);
  useEffect(() => storageService.hasViewedQrInstructions.observe(setHasViewedQrInstructions), [
    storageService.hasViewedQrInstructions,
  ]);
  useEffect(() => storageService.qrEnabled.observe(setQrEnabledInternal), [storageService.qrEnabled]);

  const [importantMessage, setImportantMessageInternal] = useState(storageService.importantMessage.get());
  const setImportantMessage = useMemo(() => storageService.setImportantMessage, [storageService.setImportantMessage]);
  useEffect(() => storageService.importantMessage.observe(setImportantMessageInternal), [
    storageService.importantMessage,
  ]);

  const reset = useCallback(async () => {
    setOnboarded(false);
    setDecommissioned(false);
    setLocale(getSystemLocale());
    setRegion(undefined);
    setOnboardedDatetime(undefined);
    setSkipAllSet(false);
    setUserStopped(false);
    setHasViewedQr(false);
    await DefaultStorageService.sharedInstance().deteleAll();
    if (__DEV__) {
      DevSettings.reload('Reset app');
    }
  }, [
    setLocale,
    setOnboarded,
    setDecommissioned,
    setOnboardedDatetime,
    setRegion,
    setSkipAllSet,
    setUserStopped,
    setHasViewedQr,
  ]);

  return useMemo(
    () => ({
      isOnboarding,
      setOnboarded,
      setDecommissioned,
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
      userStopped,
      setUserStopped,
      hasViewedQrInstructions,
      setHasViewedQr,
      qrEnabled,
      setQrEnabled,
      importantMessage,
      setImportantMessage,
    }),
    [
      isOnboarding,
      setOnboarded,
      setDecommissioned,
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
      userStopped,
      setUserStopped,
      hasViewedQrInstructions,
      setHasViewedQr,
      qrEnabled,
      setQrEnabled,
      importantMessage,
      setImportantMessage,
    ],
  );
};
