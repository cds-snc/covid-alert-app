import {TEST_MODE} from 'env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Key} from 'services/StorageService';
import PushNotification from 'bridge/PushNotification';
import {useI18nRef, I18n} from 'locale';
import PQueue from 'p-queue';

// eslint-disable-next-line @shopify/strict-component-boundaries
import {DefaultSecureKeyValueStore, SecureKeyValueStore} from '../services/MetricsService/SecureKeyValueStorage';

import {Observable} from './Observable';
import {
  CheckInData,
  getNewOutbreakExposures,
  getMatchedOutbreakHistoryItems,
  getOutbreakEvents,
  isExposedToOutbreak,
  OutbreakHistoryItem,
} from './qr';
import {createCancellableCallbackPromise} from './cancellablePromise';
import {getCurrentDate, minutesBetween} from './date-fns';
import {log} from './logging/config';

const OutbreaksLastCheckedStorageKey = 'A436ED42-707E-11EB-9439-0242AC130002';

const MIN_OUTBREAKS_CHECK_MINUTES = TEST_MODE ? 15 : 240;

export class OutbreakService implements OutbreakService {
  private static instance: OutbreakService;

  static sharedInstance(i18n: I18n): OutbreakService {
    if (!this.instance) {
      this.instance = new this(i18n);
    }
    return this.instance;
  }

  outbreakHistory: Observable<OutbreakHistoryItem[]>;
  checkInHistory: Observable<CheckInData[]>;
  i18n: I18n;
  secureKeyValueStore: SecureKeyValueStore;

  private serialPromiseQueue: PQueue;

  constructor(i18n: I18n) {
    this.outbreakHistory = new Observable<OutbreakHistoryItem[]>([]);
    this.checkInHistory = new Observable<CheckInData[]>([]);
    this.i18n = i18n;
    this.secureKeyValueStore = new DefaultSecureKeyValueStore();
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  clearOutbreakHistory = async () => {
    await AsyncStorage.setItem(Key.OutbreakHistory, JSON.stringify([]));
    this.outbreakHistory.set([]);
  };

  addToOutbreakHistory = async (value: OutbreakHistoryItem[]) => {
    const _outbreakHistory = (await AsyncStorage.getItem(Key.OutbreakHistory)) || '[]';
    const outbreakHistory = JSON.parse(_outbreakHistory);
    const newOutbreakHistory = outbreakHistory.concat(value);
    await AsyncStorage.setItem(Key.OutbreakHistory, JSON.stringify(newOutbreakHistory));
    this.outbreakHistory.set(newOutbreakHistory);
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

  checkForOutbreaks = async (forceCheck?: boolean) => {
    return this.serialPromiseQueue.add(() => {
      return this.getOutbreaksLastCheckedDateTime().then(async outbreaksLastCheckedDateTime => {
        if (forceCheck === false && outbreaksLastCheckedDateTime) {
          const today = getCurrentDate();
          const minutesSinceLastOutbreaksCheck = minutesBetween(outbreaksLastCheckedDateTime, today);
          if (minutesSinceLastOutbreaksCheck > MIN_OUTBREAKS_CHECK_MINUTES) {
            await this.getOutbreaksFromServer();
          }
        } else {
          await this.getOutbreaksFromServer();
        }
      });
    });
  };

  getOutbreaksFromServer = async () => {
    const outbreakEvents = await getOutbreakEvents();
    const detectedOutbreakExposures = getMatchedOutbreakHistoryItems(this.checkInHistory.get(), outbreakEvents);
    this.markOutbreaksLastCheckedDateTime(getCurrentDate());
    log.debug({payload: {detectedOutbreakExposures}});
    if (detectedOutbreakExposures.length === 0) {
      return;
    }
    const newOutbreakExposures = getNewOutbreakExposures(detectedOutbreakExposures, this.outbreakHistory.get());
    if (newOutbreakExposures.length === 0) {
      return;
    }
    await this.addToOutbreakHistory(newOutbreakExposures);
    const outbreakHistory = this.outbreakHistory.get();
    log.debug({payload: {outbreakHistory}});
    this.processOutbreakNotification(outbreakHistory);
  };

  processOutbreakNotification = (outbreakHistory: OutbreakHistoryItem[]) => {
    if (isExposedToOutbreak(outbreakHistory)) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.OutbreakMessageTitle'),
        alertBody: this.i18n.translate('Notification.OutbreakMessageBody'),
        channelName: this.i18n.translate('Notification.AndroidChannelName'),
      });
    }
  };

  private getOutbreaksLastCheckedDateTime(): Promise<Date | null> {
    return this.secureKeyValueStore
      .retrieve(OutbreaksLastCheckedStorageKey)
      .then(value => (value ? new Date(Number(value)) : null));
  }

  private markOutbreaksLastCheckedDateTime(date: Date): Promise<void> {
    return this.secureKeyValueStore.save(OutbreaksLastCheckedStorageKey, `${date.getTime()}`);
  }
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
  const [outbreakHistory, setOutbreakHistoryInternal] = useState(outbreakService.outbreakHistory.get());

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

  const clearOutbreakHistory = useMemo(
    () => () => {
      outbreakService.clearOutbreakHistory();
    },
    [outbreakService],
  );

  useEffect(() => outbreakService.checkInHistory.observe(addCheckInInternal), [outbreakService.checkInHistory]);
  useEffect(() => outbreakService.outbreakHistory.observe(setOutbreakHistoryInternal), [
    outbreakService.outbreakHistory,
  ]);

  return useMemo(
    () => ({
      outbreakHistory,
      clearOutbreakHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      checkInHistory,
    }),
    [outbreakHistory, clearOutbreakHistory, checkForOutbreaks, addCheckIn, removeCheckIn, checkInHistory],
  );
};
