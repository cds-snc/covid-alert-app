import {TEST_MODE} from 'env';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {DefaultStorageService, StorageService, StorageDirectory} from 'services/StorageService';
import PushNotification from 'bridge/PushNotification';
import {useI18nRef, I18n} from 'locale';
import PQueue from 'p-queue';

import {Observable} from './Observable';
import {
  CheckInData,
  getNewOutbreakExposures,
  getMatchedOutbreakHistoryItems,
  getOutbreakEvents,
  isExposedToOutbreak,
  OutbreakHistoryItem,
  CombinedExposureHistoryData,
} from './qr';
import {createCancellableCallbackPromise} from './cancellablePromise';
import {getCurrentDate, minutesBetween} from './date-fns';
import {log} from './logging/config';

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
  combinedExposureHistory: Observable<CombinedExposureHistoryData[]>;
  i18n: I18n;
  storageService: StorageService;

  private serialPromiseQueue: PQueue;

  constructor(i18n: I18n) {
    this.outbreakHistory = new Observable<OutbreakHistoryItem[]>([]);
    this.checkInHistory = new Observable<CheckInData[]>([]);
    this.combinedExposureHistory = new Observable<CombinedExposureHistoryData[]>([]);
    this.i18n = i18n;
    this.storageService = DefaultStorageService.sharedInstance();
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  clearOutbreakHistory = async () => {
    await this.storageService.save(StorageDirectory.OutbreakServiceOutbreakHistoryKey, JSON.stringify([]));
    this.outbreakHistory.set([]);
  };

  addToOutbreakHistory = async (value: OutbreakHistoryItem[]) => {
    const _outbreakHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceOutbreakHistoryKey)) || '[]';
    const outbreakHistory = JSON.parse(_outbreakHistory);
    const newOutbreakHistory = outbreakHistory.concat(value);
    await this.storageService.save(
      StorageDirectory.OutbreakServiceOutbreakHistoryKey,
      JSON.stringify(newOutbreakHistory),
    );
    this.outbreakHistory.set(newOutbreakHistory);
  };

  addToCombinedExposureHistory = async (value: CombinedExposureHistoryData) => {
    const _combinedExposureHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCombinedExposureHistoryKey)) || '[]';
    const combinedExposureHistory = JSON.parse(_combinedExposureHistory);
    console.log('value', value);
    combinedExposureHistory.push(value);
    await this.storageService.save(
      StorageDirectory.OutbreakServiceCombinedExposureHistoryKey,
      JSON.stringify(combinedExposureHistory),
    );
    this.combinedExposureHistory.set(combinedExposureHistory);
  };

  addCheckIn = async (value: CheckInData) => {
    const _checkInHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    const checkInHistory = JSON.parse(_checkInHistory);
    checkInHistory.push(value);
    await this.storageService.save(StorageDirectory.OutbreakServiceCheckInHistoryKey, JSON.stringify(checkInHistory));
    this.checkInHistory.set(checkInHistory);
  };

  removeCheckIn = async () => {
    // removes most recent Check In
    const _checkInHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    const checkInHistory = JSON.parse(_checkInHistory);
    const newCheckInHistory = checkInHistory.slice(0, -1);
    await this.storageService.save(
      StorageDirectory.OutbreakServiceCheckInHistoryKey,
      JSON.stringify(newCheckInHistory),
    );
    this.checkInHistory.set(newCheckInHistory);
  };

  deleteScannedPlaces = async (value: string) => {
    const _checkInHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    const checkInHistory = JSON.parse(_checkInHistory);
    const index = checkInHistory.findIndex((item: {id: string}) => item.id === value);
    const newCheckInHistory = checkInHistory;
    if (index !== -1) {
      newCheckInHistory.splice(index, 1);
    }

    await this.storageService.save(
      StorageDirectory.OutbreakServiceCheckInHistoryKey,
      JSON.stringify(newCheckInHistory),
    );
    this.checkInHistory.set(newCheckInHistory);
  };

  deleteAllScannedPlaces = async () => {
    await this.storageService.save(StorageDirectory.OutbreakServiceCheckInHistoryKey, JSON.stringify([]));
    this.checkInHistory.set([]);
  };

  deleteAllCombinedExposureHistory = async () => {
    await this.storageService.save(StorageDirectory.OutbreakServiceCombinedExposureHistoryKey, JSON.stringify([]));
    this.combinedExposureHistory.set([]);
  };

  init = async () => {
    const outbreakHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceOutbreakHistoryKey)) || '[]';
    this.outbreakHistory.set(JSON.parse(outbreakHistory));

    const checkInHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    this.checkInHistory.set(JSON.parse(checkInHistory));

    const combinedExposureHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCombinedExposureHistoryKey)) || '[]';
    this.combinedExposureHistory.set(JSON.parse(combinedExposureHistory));
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
    return this.storageService
      .retrieve(StorageDirectory.OutbreakProviderOutbreaksLastCheckedStorageKey)
      .then(value => (value ? new Date(Number(value)) : null));
  }

  private markOutbreaksLastCheckedDateTime(date: Date): Promise<void> {
    return this.storageService.save(
      StorageDirectory.OutbreakProviderOutbreaksLastCheckedStorageKey,
      `${date.getTime()}`,
    );
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
  const [combinedExposureHistory, setCombinedExposureHistoryInternal] = useState(
    outbreakService.combinedExposureHistory.get(),
  );

  const checkForOutbreaks = useMemo(() => outbreakService.checkForOutbreaks, [outbreakService.checkForOutbreaks]);
  const addCheckIn = useMemo(
    () => (newCheckIn: CheckInData) => {
      outbreakService.addCheckIn(newCheckIn);
    },
    [outbreakService],
  );

  const addToCombinedExposureHistory = useMemo(
    () => (history: CombinedExposureHistoryData) => {
      outbreakService.addToCombinedExposureHistory(history);
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
  const deleteScannedPlaces = useMemo(
    () => (id: string) => {
      outbreakService.deleteScannedPlaces(id);
    },
    [outbreakService],
  );

  const deleteAllScannedPlaces = useMemo(
    () => () => {
      outbreakService.deleteAllScannedPlaces();
    },
    [outbreakService],
  );

  const deleteAllCombinedExposureHistory = useMemo(
    () => () => {
      outbreakService.deleteAllCombinedExposureHistory();
    },
    [outbreakService],
  );

  useEffect(() => outbreakService.checkInHistory.observe(addCheckInInternal), [outbreakService.checkInHistory]);
  useEffect(() => outbreakService.outbreakHistory.observe(setOutbreakHistoryInternal), [
    outbreakService.outbreakHistory,
  ]);
  useEffect(() => outbreakService.combinedExposureHistory.observe(setCombinedExposureHistoryInternal), [
    outbreakService.combinedExposureHistory,
  ]);

  return useMemo(
    () => ({
      outbreakHistory,
      clearOutbreakHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      deleteScannedPlaces,
      deleteAllScannedPlaces,
      checkInHistory,
      combinedExposureHistory,
      addToCombinedExposureHistory,
      deleteAllCombinedExposureHistory,
    }),
    [
      outbreakHistory,
      clearOutbreakHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      deleteScannedPlaces,
      deleteAllScannedPlaces,
      checkInHistory,
      combinedExposureHistory,
      addToCombinedExposureHistory,
      deleteAllCombinedExposureHistory,
    ],
  );
};
