import AsyncStorage from '@react-native-community/async-storage';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Key} from 'services/StorageService';
import PushNotification from 'bridge/PushNotification';
import {useI18nRef, I18n} from 'locale';

import {Observable} from './Observable';
import {CheckInData, getNewOutbreakHistory, getOutbreakEvents, isExposed, OutbreakHistoryItem} from './qr';
import {createCancellableCallbackPromise} from './cancellablePromise';

class OutbreakService implements OutbreakService {
  outbreakHistory: Observable<OutbreakHistoryItem[]>;
  checkInHistory: Observable<CheckInData[]>;
  i18n: I18n;

  constructor(i18n: I18n) {
    this.outbreakHistory = new Observable<OutbreakHistoryItem[]>([]);
    this.checkInHistory = new Observable<CheckInData[]>([]);
    this.i18n = i18n;
  }

  setOutbreakHistory = async (value: OutbreakHistoryItem[]) => {
    await AsyncStorage.setItem(Key.OutbreakHistory, JSON.stringify(value));
    this.outbreakHistory.set(value);
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
    const outbreakHistory = (await AsyncStorage.getItem(Key.OutbreakHistory)) || '[]';
    this.outbreakHistory.set(JSON.parse(outbreakHistory));

    const checkInHistory = (await AsyncStorage.getItem(Key.CheckInHistory)) || '[]';
    this.checkInHistory.set(JSON.parse(checkInHistory));
  };

  checkForOutbreaks = async () => {
    const outbreakEvents = await getOutbreakEvents();
    const newOutbreakHistory = getNewOutbreakHistory(this.checkInHistory.get(), outbreakEvents);
    this.setOutbreakHistory(newOutbreakHistory);
    this.processOutbreakNotification(newOutbreakHistory);
  };

  processOutbreakNotification = (outbreakHistory: OutbreakHistoryItem[]) => {
    if (isExposed(outbreakHistory)) {
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
  }, [i18n]);

  return <OutbreakContext.Provider value={{outbreakService}}>{outbreakService && children}</OutbreakContext.Provider>;
};

export const useOutbreakService = () => {
  const outbreakService = useContext(OutbreakContext)!.outbreakService!;
  const [checkInHistory, addCheckInInternal] = useState(outbreakService.checkInHistory.get());
  const [outbreakHistory] = useState(outbreakService.outbreakHistory.get());

  const checkForOutbreaks = useMemo(() => outbreakService.checkForOutbreaks, [outbreakService.checkForOutbreaks]);
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

  useEffect(() => outbreakService.checkInHistory.observe(addCheckInInternal), [outbreakService.checkInHistory]);

  return useMemo(
    () => ({
      outbreakHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      checkInHistory,
    }),
    [outbreakHistory, checkForOutbreaks, addCheckIn, removeCheckIn, checkInHistory],
  );
};
