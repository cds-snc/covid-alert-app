import {Buffer} from 'buffer';

import {TEST_MODE} from 'env';
import {StorageService, StorageDirectory, DefaultStorageService} from 'services/StorageService';
import PushNotification from 'bridge/PushNotification';
import {I18n} from 'locale';
import PQueue from 'p-queue';
import {BackendInterface} from 'services/BackendService';
import {unzip} from 'react-native-zip-archive';
import {readFile} from 'react-native-fs';
import {covidshield} from 'services/BackendService/covidshield';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';
import {getRandomString} from 'shared/logging/uuid';

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

export interface OutbreakEvent {
  // Don't use this for anything besides the dedup code.
  // dedupeId will change each time we get new data from the server.
  dedupeId: string;
  locationId: string;
  // ms
  startTime: number;
  // ms
  endTime: number;
  severity: number;
}

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
  private storageService: StorageService;

  constructor(i18n: I18n, backendService: BackendInterface) {
    this.outbreakHistory = new Observable<OutbreakHistoryItem[]>([]);
    this.checkInHistory = new Observable<CheckInData[]>([]);
    this.i18n = i18n;
    this.backendService = backendService;
    this.serialPromiseQueue = new PQueue({concurrency: 1});
    this.storageService = DefaultStorageService.sharedInstance();
  }

  clearOutbreakHistory = async () => {
    this.outbreakHistory.get().forEach(outbreak => {
      outbreak.isIgnored = true;
    });
    await this.storageService.save(
      StorageDirectory.OutbreakServiceOutbreakHistoryKey,
      JSON.stringify(this.outbreakHistory.get()),
    );
  };

  ignoreOutbreak = async (outbreakId: string) => {
    this.outbreakHistory
      .get()
      .filter(outbreak => outbreak.outbreakId === outbreakId)
      .forEach(outbreak => {
        outbreak.isIgnored = true;
      });
    await this.storageService.save(
      StorageDirectory.OutbreakServiceOutbreakHistoryKey,
      JSON.stringify(this.outbreakHistory.get()),
    );
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

  addCheckIn = async (value: CheckInData) => {
    const _checkInHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    const checkInHistory = JSON.parse(_checkInHistory);
    checkInHistory.push(value);
    this.storageService.save(StorageDirectory.OutbreakServiceCheckInHistoryKey, JSON.stringify(checkInHistory));
    this.checkInHistory.set(checkInHistory);
  };

  removeCheckIn = async (locationId?: string, timestamp?: number) => {
    const _checkInHistory: string =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    const checkInHistory: CheckInData[] = JSON.parse(_checkInHistory);
    let newCheckInHistory;
    if (locationId && timestamp) {
      // removes a specific Check In
      newCheckInHistory = checkInHistory.filter(checkInData => {
        return !(locationId === checkInData.id && timestamp === checkInData.timestamp);
      });
    } else {
      // removes most recent Check In
      checkInHistory.pop();
      newCheckInHistory = checkInHistory;
    }

    await this.storageService.save(
      StorageDirectory.OutbreakServiceCheckInHistoryKey,
      JSON.stringify(newCheckInHistory),
    );
    this.checkInHistory.set(newCheckInHistory);
  };

  clearCheckInHistory = async () => {
    await this.storageService.save(StorageDirectory.OutbreakServiceCheckInHistoryKey, JSON.stringify([]));
    this.checkInHistory.set([]);
  };

  init = async () => {
    const outbreakHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceOutbreakHistoryKey)) || '[]';
    this.outbreakHistory.set(JSON.parse(outbreakHistory));

    const checkInHistory =
      (await this.storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';
    this.checkInHistory.set(JSON.parse(checkInHistory));
  };

  checkForOutbreaks = async (forceCheck?: boolean) => {
    return this.serialPromiseQueue.add(async () => {
      if ((await this.shouldPerformOutbreaksCheck()) || forceCheck === true) {
        const outbreaksFileUrls: string[] = [];
        const outbreaksLastCheckedDate = await getOutbreaksLastCheckedDateTime(this.storageService);
        const lastCheckedPeriod = outbreaksLastCheckedDate
          ? periodSinceEpoch(outbreaksLastCheckedDate, HOURS_PER_PERIOD)
          : undefined;

        const periodsSinceLastFetch = this.periodsSinceLastOutbreaksCheck(lastCheckedPeriod);

        try {
          for (const period of periodsSinceLastFetch) {
            const outbreaksFileUrl = await this.backendService.retrieveOutbreakEvents(period);
            outbreaksFileUrls.push(outbreaksFileUrl);
          }

          const outbreakEvents = await this.extractOutbreakEventsFromZipFiles(outbreaksFileUrls);
          if (outbreakEvents.length === 0) {
            return;
          }

          markOutbreaksLastCheckedDateTime(this.storageService, getCurrentDate());

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

          if (isExposedToOutbreak(outbreakHistory)) {
            FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ExposedToOutbreak});
            this.processOutbreakNotification();
          }
        } catch (error) {
          log.error({category: 'qr-code', error});
        }
      }
    });
  };

  shouldPerformOutbreaksCheck = async (): Promise<boolean> => {
    try {
      const outbreaksLastCheckedDateTime = await getOutbreaksLastCheckedDateTime(this.storageService);
      if (outbreaksLastCheckedDateTime === null) return true;
      const today = getCurrentDate();
      const minutesSinceLastOutbreaksCheck = minutesBetween(outbreaksLastCheckedDateTime, today);
      return minutesSinceLastOutbreaksCheck > MIN_OUTBREAKS_CHECK_MINUTES;
    } catch {
      return true;
    }
  };

  convertOutbreakEvents = (outbreakEvents: covidshield.OutbreakEvent[]): OutbreakEvent[] => {
    return outbreakEvents.map(event => {
      return {
        dedupeId: getRandomString(8),
        locationId: event.locationId,
        endTime: 1000 * Number(event.endTime?.seconds),
        startTime: 1000 * Number(event.startTime?.seconds),
        severity: event.severity,
      };
    });
  };

  extractOutbreakEventsFromZipFiles = async (outbreaksURLs: string[]): Promise<OutbreakEvent[]> => {
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

    return this.convertOutbreakEvents(outbreakEvents);
  };

  processOutbreakNotification = () => {
    PushNotification.presentLocalNotification({
      alertTitle: this.i18n.translate('Notification.OutbreakMessageTitle'),
      alertBody: this.i18n.translate('Notification.OutbreakMessageIsolate'),
      channelName: this.i18n.translate('Notification.AndroidChannelName'),
    });
  };

  // TODO: refactor this method to share logic with getPeriodsSinceLastFetch method found in ExposureNotificationService.
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
