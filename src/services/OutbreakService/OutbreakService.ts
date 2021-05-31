import {Buffer} from 'buffer';

import {Platform} from 'react-native';
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
import {isOutbreakSignatureValid} from 'bridge/OutbreakSignatureValidation';
import {ExposureStatusType} from 'services/ExposureNotificationService';

import {Observable} from '../../shared/Observable';
import {
  CheckInData,
  getMatchedOutbreakHistoryItems,
  getNewOutbreakExposures,
  isExposedToOutbreak,
  OutbreakHistoryItem,
  expireHistoryItems,
} from '../../shared/qr';
import {getCurrentDate, minutesBetween, periodSinceEpoch} from '../../shared/date-fns';
import {log} from '../../shared/logging/config';

import {getOutbreaksLastCheckedDateTime, markOutbreaksLastCheckedDateTime} from './OutbreakStorage';

// const MIN_OUTBREAKS_CHECK_MINUTES = TEST_MODE ? 15 : 240;
const MIN_OUTBREAKS_CHECK_MINUTES = 120;

export const HOURS_PER_PERIOD = 24;

export const EXPOSURE_NOTIFICATION_CYCLE = 14;

const base64ToUint8Array = (str: string) => {
  return new Uint8Array(Array.prototype.slice.call(Buffer.from(str, 'base64'), 0));
};

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

  static async sharedInstance(i18n: I18n, backendService: BackendInterface): Promise<OutbreakService> {
    if (!this.instance) {
      const storageService = DefaultStorageService.sharedInstance();
      const outbreakHistory =
        (await storageService.retrieve(StorageDirectory.OutbreakServiceOutbreakHistoryKey)) || '[]';
      const checkInHistory = (await storageService.retrieve(StorageDirectory.OutbreakServiceCheckInHistoryKey)) || '[]';

      this.instance = new this(
        i18n,
        backendService,
        storageService,
        JSON.parse(outbreakHistory),
        JSON.parse(checkInHistory),
      );
    }
    return this.instance;
  }

  outbreakHistory: Observable<OutbreakHistoryItem[]>;
  checkInHistory: Observable<CheckInData[]>;
  i18n: I18n;
  backendService: BackendInterface;
  private serialPromiseQueue: PQueue;
  private storageService: StorageService;

  private constructor(
    i18n: I18n,
    backendService: BackendInterface,
    storageService: StorageService,
    outbreakHistory: OutbreakHistoryItem[],
    checkInHistory: CheckInData[],
  ) {
    this.outbreakHistory = new Observable<OutbreakHistoryItem[]>(outbreakHistory);
    this.checkInHistory = new Observable<CheckInData[]>(checkInHistory);
    this.i18n = i18n;
    this.backendService = backendService;
    this.serialPromiseQueue = new PQueue({concurrency: 1});
    this.storageService = storageService;
  }

  ignoreAllOutbreaks = async () => {
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
      .filter(outbreak => outbreak.id === outbreakId)
      .forEach(outbreak => {
        outbreak.isIgnored = true;
      });
    await this.storageService.save(
      StorageDirectory.OutbreakServiceOutbreakHistoryKey,
      JSON.stringify(this.outbreakHistory.get()),
    );
  };

  ignoreAllOutbreaksFromHistory = async () => {
    this.outbreakHistory.get().forEach(outbreak => {
      outbreak.isIgnoredFromHistory = true;
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

  expireHistoryItemsAndSave = async (outbreakHistory: OutbreakHistoryItem[]) => {
    if (!outbreakHistory.length) return;

    const expireHistory = expireHistoryItems(outbreakHistory);

    expireHistory.forEach((historyItem: OutbreakHistoryItem) => {
      if (historyItem.isIgnored) {
        this.ignoreOutbreak(historyItem.id);
      }
    });
  };

  checkForOutbreaks = async (forceCheck?: boolean) => {
    this.expireHistoryItemsAndSave(this.outbreakHistory.get());
    return this.serialPromiseQueue.add(async () => {
      log.debug({category: 'qr-code', message: 'fetching outbreak locations...'});
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

          log.debug({
            category: 'qr-code',
            message: 'checkForOutbreaks',
            payload: {outbreakEvents, checkInHistory: this.checkInHistory.get()},
          });

          if (outbreakEvents.length === 0) {
            return;
          }

          markOutbreaksLastCheckedDateTime(this.storageService, getCurrentDate());

          const detectedOutbreakExposures = getMatchedOutbreakHistoryItems(this.checkInHistory.get(), outbreakEvents);

          if (detectedOutbreakExposures.length === 0) {
            log.debug({
              category: 'qr-code',
              message: 'detectedOutbreakExposures === 0',
            });
            return;
          }

          const newOutbreakExposures = getNewOutbreakExposures(detectedOutbreakExposures, this.outbreakHistory.get());
          if (newOutbreakExposures.length === 0) {
            log.debug({
              category: 'qr-code',
              message: 'newOutbreakExposures === 0',
            });
            return;
          }

          await this.addToOutbreakHistory(newOutbreakExposures);

          const outbreakHistory = this.outbreakHistory.get();

          if (isExposedToOutbreak(outbreakHistory)) {
            log.debug({
              category: 'qr-code',
              message: 'exposed',
            });
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
      log.debug({
        category: 'qr-code',
        message: 'shouldPerformOutbreaksCheck-minutesSinceLastOutbreaksCheck',
        payload: {minutesSinceLastOutbreaksCheck},
      });
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
      const outbreakFileSig = await readFile(`${unzippedLocation}/export.sig`, 'base64');
      const outbreakBinBuffer = Buffer.from(outbreakFileBin, 'base64');

      try {
        const outbreakFileSigDecoded = covidshield.OutbreakEventExportSignature.decode(
          base64ToUint8Array(outbreakFileSig),
        );

        const outbreakFileSigDecodedJSON = outbreakFileSigDecoded.toJSON();

        // need to add for iOS
        if (Platform.OS === 'android') {
          const isValid = await isOutbreakSignatureValid(outbreakFileBin, outbreakFileSigDecodedJSON.signature);

          if (!isValid) {
            throw new Error('outbreak data signature match failed');
          }

          log.debug({
            category: 'qr-code',
            message: 'has valid signature',
            payload: {signature: outbreakFileSigDecodedJSON.signature, bin: outbreakFileBin, isValid},
          });
        }
      } catch (err) {
        log.error({
          category: 'qr-code',
          message: err.message,
        });
      }

      const outbreakEventExport = covidshield.OutbreakEventExport.decode(outbreakBinBuffer);
      for (const location of outbreakEventExport.locations) {
        outbreakEvents.push(location as covidshield.OutbreakEvent);
      }
    }

    log.debug({
      category: 'qr-code',
      message: 'extractOutbreakEventsFromZipFiles',
      payload: outbreaks,
    });

    return this.convertOutbreakEvents(outbreakEvents);
  };

  processOutbreakNotification = () => {
    log.debug({
      category: 'qr-code',
      message: 'processOutbreakNotification',
    });

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

export const isDiagnosed = (status: string): boolean => {
  if (status === ExposureStatusType.Diagnosed) {
    return true;
  }
  return false;
};
