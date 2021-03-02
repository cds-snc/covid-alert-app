import {Buffer} from 'buffer';

import {HMAC_KEY, RETRIEVE_URL, SUBMIT_URL, TEST_MODE} from 'env';
import AsyncStorage from '@react-native-community/async-storage';
import {Key} from 'services/StorageService';
import PushNotification from 'bridge/PushNotification';
import {I18n} from 'locale';
import PQueue from 'p-queue';
import {BackendInterface} from 'services/BackendService';
import {unzip} from 'react-native-zip-archive';
import {readFile} from 'react-native-fs';
import {covidshield} from 'services/BackendService/covidshield';

import {Observable} from '../../shared/Observable';
import {
  CheckInData,
  getMatchedOutbreakHistoryItems,
  getNewOutbreakExposures,
  isExposedToOutbreak,
  OutbreakHistoryItem,
} from '../../shared/qr';
import {getCurrentDate, minutesBetween, periodSinceEpoch} from '../../shared/date-fns';
import {log} from '../../shared/logging/config';

import {getOutbreaksLastCheckedDateTime, markOutbreaksLastCheckedDateTime} from './OutbreakStorage';

const MIN_OUTBREAKS_CHECK_MINUTES = TEST_MODE ? 15 : 240;

export const HOURS_PER_PERIOD = 24;

export const EXPOSURE_NOTIFICATION_CYCLE = 14;

export class OutbreakService {
  private static instance: OutbreakService;

  static sharedInstance(i18n: I18n, backendService: BackendInterface): OutbreakService {
    if (!this.instance) {
      this.instance = new this(i18n, backendService);
    }
    return this.instance;
  }

  outbreakHistory: Observable<OutbreakHistoryItem[]>;
  checkInHistory: Observable<CheckInData[]>;
  i18n: I18n;
  backendService: BackendInterface;
  private serialPromiseQueue: PQueue;

  constructor(i18n: I18n, backendService: BackendInterface) {
    this.outbreakHistory = new Observable<OutbreakHistoryItem[]>([]);
    this.checkInHistory = new Observable<CheckInData[]>([]);
    this.i18n = i18n;
    this.backendService = backendService;
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
    return this.serialPromiseQueue.add(async () => {
      if ((await this.shouldPerformOutbreaksCheck()) || forceCheck === true) {
        const outbreaksFileUrls: string[] = [];
        const periodsSinceLastFetch = [0];
        try {
          for (const period of periodsSinceLastFetch) {
            const outbreaksFileUrl = await this.backendService.retrieveOutbreakEvents(period);
            outbreaksFileUrls.push(outbreaksFileUrl);
          }

          const outbreakEvents: covidshield.OutbreakEvent[] = await this.extractOutbreakEventsFromZipFiles(
            outbreaksFileUrls,
          );
          if (outbreakEvents.length === 0) {
            return;
          }

          markOutbreaksLastCheckedDateTime(getCurrentDate());

          const detectedOutbreakExposures = getMatchedOutbreakHistoryItems(this.checkInHistory.get(), outbreakEvents);

          if (detectedOutbreakExposures.length === 0) {
            return;
          }

          const newOutbreakExposures = getNewOutbreakExposures(detectedOutbreakExposures, this.outbreakHistory.get());
          if (newOutbreakExposures.length === 0) {
            return;
          }

          await this.addToOutbreakHistory(newOutbreakExposures);

          const outbreakHistory = this.outbreakHistory.get();

          this.processOutbreakNotification(outbreakHistory);
        } catch (error) {
          log.error(error);
        }
      }
    });
  };

  shouldPerformOutbreaksCheck = async (): Promise<boolean> => {
    try {
      const outbreaksLastCheckedDateTime = await getOutbreaksLastCheckedDateTime();
      if (outbreaksLastCheckedDateTime === null) return true;
      const today = getCurrentDate();
      const minutesSinceLastOutbreaksCheck = minutesBetween(outbreaksLastCheckedDateTime, today);
      return minutesSinceLastOutbreaksCheck > MIN_OUTBREAKS_CHECK_MINUTES;
    } catch {
      return true;
    }
  };

  extractOutbreakEventsFromZipFiles = async (outbreaksURLs: string[]): Promise<covidshield.OutbreakEvent[]> => {
    const outbreaks: any[] = [];
    if (outbreaksURLs.length === 0) {
      throw new Error('');
    }

    const outbreakEvents: covidshield.OutbreakEvent[] = [];

    for (const outbreaksZipUrl of outbreaksURLs) {
      const components = outbreaksZipUrl.split('/');
      components.pop();
      components.push('keys-export');
      const targetDir = components.join('/');
      const unzippedLocation = await unzip(outbreaksZipUrl, targetDir);
      const outbreakFileBin = await readFile(`${unzippedLocation}/export.bin`, 'base64');
      const outbreakBinBuffer = Buffer.from(outbreakFileBin, 'base64');
      const outbreakEventExport = covidshield.OutbreakEventExport.decode(outbreakBinBuffer);
      for (const location of outbreakEventExport.locations) {
        outbreakEvents.push(location as covidshield.OutbreakEvent);
      }
    }

    log.debug({
      category: 'exposure-check',
      payload: outbreaks,
    });

    return outbreakEvents;
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

  periodsSinceLastOutbreaksCheck = (_lastCheckedPeriod?: number): number[] => {
    const runningDate = getCurrentDate();
    let runningPeriod = periodSinceEpoch(runningDate, HOURS_PER_PERIOD);
    if (!_lastCheckedPeriod) {
      return [0, runningPeriod];
    }
    const lastCheckedPeriod = Math.max(_lastCheckedPeriod - 1, runningPeriod - EXPOSURE_NOTIFICATION_CYCLE);
    const periodsToFetch = [];
    while (runningPeriod > lastCheckedPeriod) {
      periodsToFetch.push(runningPeriod);
      runningPeriod -= 1;
    }
    return periodsToFetch;
  };
}
