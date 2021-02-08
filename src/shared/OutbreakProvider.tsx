import AsyncStorage from '@react-native-community/async-storage';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Key} from 'services/StorageService';
import PushNotification from 'bridge/PushNotification';
import {Observable} from './Observable';
import {useI18nRef, I18n} from 'locale';
import {CheckInData, getNewOutbreakStatus, initialOutbreakStatus, OutbreakStatus, OutbreakStatusType} from './qr';
import {createCancellableCallbackPromise} from './cancellablePromise';

class OutbreakService implements OutbreakService {
  outbreakStatus: Observable<OutbreakStatus>;
  checkInHistory: Observable<CheckInData[]>;
  i18n: I18n;

  constructor(i18n: I18n) {
    this.outbreakStatus = new Observable<OutbreakStatus>(initialOutbreakStatus);
    this.checkInHistory = new Observable<CheckInData[]>([]);
    this.i18n = i18n;
  }

  setOutbreakStatus = async (value: OutbreakStatus) => {
    await AsyncStorage.setItem(Key.OutbreakStatus, JSON.stringify(value));
    this.outbreakStatus.set(value);
  };

  addCheckIn = async (value: CheckInData) => {
    const _checkInHistory = (await AsyncStorage.getItem(Key.CheckInHistory)) || '[]';
    const checkInHistory = JSON.parse(_checkInHistory);
    checkInHistory.push(value);
    await AsyncStorage.setItem(Key.CheckInHistory, JSON.stringify(checkInHistory));
    this.checkInHistory.set(checkInHistory);
  };

  removeCheckIn = async () => {
    // removes most recent Check In
    const _checkInHistory = (await AsyncStorage.getItem(Key.CheckInHistory)) || '[]';
    const checkInHistory = JSON.parse(_checkInHistory);
    const newCheckInHistory = checkInHistory.slice(0, -1);
    await AsyncStorage.setItem(Key.CheckInHistory, JSON.stringify(newCheckInHistory));
    this.checkInHistory.set(newCheckInHistory);
  };

  init = async () => {
    const outbreakStatus = (await AsyncStorage.getItem(Key.OutbreakStatus)) || JSON.stringify(initialOutbreakStatus);
    this.outbreakStatus.set(JSON.parse(outbreakStatus));

    const checkInHistory = (await AsyncStorage.getItem(Key.CheckInHistory)) || '[]';
    this.checkInHistory.set(JSON.parse(checkInHistory));
  };

  checkForExposures = async () => {
    const newOutbreakStatusType = await getNewOutbreakStatus(this.checkInHistory.get());
    this.setOutbreakStatus(newOutbreakStatusType);
    this.processOutbreakNotification(newOutbreakStatusType);
  };
  processOutbreakNotification = (status: OutbreakStatus) => {
    if (status.type === 'exposed') {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.OutbreakMessageTitle'),
        alertBody: this.i18n.translate('Notification.OutbreakMessageBody'),
        channelName: this.i18n.translate('Notification.AndroidChannelName'),
      });
    }
  };
}

export const createOutbreakService = async (i18n: I18n) => {
  const service = new OutbreakService(i18n);
  await service.init();
  return service;
};

interface OutbreakProviderProps {
  outbreakService?: OutbreakService;
  children?: React.ReactElement;
}

export const OutbreakContext = React.createContext<OutbreakProviderProps | undefined>(undefined);

export const OutbreakProvider = ({children}: OutbreakProviderProps) => {
  const [outbreakService, setOutbreakService] = useState<OutbreakService>();
  const i18n = useI18nRef();
  useEffect(() => {
    const {callable, cancelable} = createCancellableCallbackPromise(
      () => createOutbreakService(i18n),
      setOutbreakService,
    );
    callable();
    return cancelable;
  }, []);

  return <OutbreakContext.Provider value={{outbreakService}}>{outbreakService && children}</OutbreakContext.Provider>;
};

export const useOutbreakService = () => {
  const outbreakService = useContext(OutbreakContext)!.outbreakService!;
  const [outbreakStatus, setOutbreakStatusInternal] = useState(outbreakService.outbreakStatus.get());
  const [checkInHistory, addCheckInInternal] = useState(outbreakService.checkInHistory.get());

  const setOutbreakStatus = useMemo(() => outbreakService.setOutbreakStatus, [outbreakService.setOutbreakStatus]);
  const checkForExposures = useMemo(() => outbreakService.checkForExposures, [outbreakService.checkForExposures]);
  const addCheckIn = useMemo(
    () => (newCheckIn: CheckInData) => {
      outbreakService.addCheckIn(newCheckIn);
    },
    [outbreakService],
  );

  const removeCheckIn = useMemo(
    () => () => {
      outbreakService.removeCheckIn();
    },
    [outbreakService],
  );
  useEffect(() => outbreakService.outbreakStatus.observe(setOutbreakStatusInternal), [outbreakService.outbreakStatus]);
  useEffect(() => outbreakService.checkInHistory.observe(addCheckInInternal), [outbreakService.checkInHistory]);

  return useMemo(
    () => ({
      outbreakStatus,
      setOutbreakStatus,
      checkForExposures,
      addCheckIn,
      removeCheckIn,
      checkInHistory,
    }),
    [outbreakStatus, setOutbreakStatus, checkForExposures, addCheckIn, removeCheckIn, checkInHistory],
  );
};
