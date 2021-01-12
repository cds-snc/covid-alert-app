import ExposureNotification, {
  ExposureSummary,
  ExposureWindow,
  Status as SystemStatus,
  ExposureConfiguration,
  TemporaryExposureKey,
  ScanInstance,
  Infectiousness,
} from 'bridge/ExposureNotification';
import PushNotification, {NotificationPayload} from 'bridge/PushNotification';
import {addDays, periodSinceEpoch, minutesBetween, getCurrentDate, daysBetweenUTC, daysBetween} from 'shared/date-fns';
import {I18n} from 'locale';
import {Observable, MapObservable} from 'shared/Observable';
import {captureException, captureMessage} from 'shared/log';
import {log} from 'shared/logging/config';
import {DeviceEventEmitter, Platform} from 'react-native';
import {ContagiousDateInfo, ContagiousDateType} from 'shared/DataSharing';
import {EN_API_VERSION} from 'env';

import {BackendInterface, SubmissionKeySet} from '../BackendService';
import {PERIODIC_TASK_INTERVAL_IN_MINUTES} from '../BackgroundSchedulerService';
import {Key} from '../StorageService';
import ExposureCheckScheduler from '../../bridge/ExposureCheckScheduler';

import exposureConfigurationDefault from './ExposureConfigurationDefault.json';
import exposureConfigurationSchema from './ExposureConfigurationSchema.json';
import {ExposureConfigurationValidator, ExposureConfigurationValidationError} from './ExposureConfigurationValidator';

const SUBMISSION_AUTH_KEYS = 'submissionAuthKeys';
const EXPOSURE_CONFIGURATION = 'exposureConfiguration';

export const EXPOSURE_STATUS = 'exposureStatus';

export const HOURS_PER_PERIOD = 24;

export const EXPOSURE_NOTIFICATION_CYCLE = 14;

export const MINIMUM_REMINDER_INTERVAL_MINUTES = 180;

export const cannotGetTEKsError = new Error('Unable to retrieve TEKs');

export {SystemStatus};

export enum ExposureStatusType {
  Monitoring = 'monitoring',
  Exposed = 'exposed',
  Diagnosed = 'diagnosed',
}

export interface LastChecked {
  period: number;
  timestamp: number;
}

export type ExposureStatus =
  | {
      type: ExposureStatusType.Monitoring;
      lastChecked?: LastChecked;
      ignoredSummaries?: ExposureSummary[];
    }
  | {
      type: ExposureStatusType.Exposed;
      summary: ExposureSummary;
      notificationSent?: boolean;
      exposureDetectedAt?: number;
      lastChecked?: LastChecked;
      ignoredSummaries?: ExposureSummary[];
    }
  | {
      type: ExposureStatusType.Diagnosed;
      needsSubmission: boolean;
      hasShared: boolean;
      isUploading: boolean;
      submissionLastCompletedAt?: number;
      uploadReminderLastSentAt?: number;
      cycleStartsAt: number;
      cycleEndsAt: number;
      lastChecked?: LastChecked;
      ignoredSummaries?: ExposureSummary[];
    };

export interface PersistencyProvider {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
}

export interface SecurePersistencyProvider {
  set(key: string, value: string, options: SecureStorageOptions): Promise<null>;
  get(key: string): Promise<string | null>;
}

export interface SecureStorageOptions {
  accessible?: string;
}

export class ExposureNotificationService {
  systemStatus: Observable<SystemStatus>;
  exposureStatus: MapObservable<ExposureStatus>;

  /**
   * Visible for testing only
   * We can make this private until ExposureNotificationClient.ACTION_EXPOSURE_NOT_FOUND is available in Android EN framework
   * Ref https://developers.google.com/android/exposure-notifications/exposure-notifications-api#broadcast-receivers
   **/
  exposureStatusUpdatePromise: Promise<void> | null = null;

  private starting = false;
  private stopping = false;

  private exposureNotification: typeof ExposureNotification;
  private backendInterface: BackendInterface;

  private i18n: I18n;
  private storage: PersistencyProvider;
  private secureStorage: SecurePersistencyProvider;

  constructor(
    backendInterface: BackendInterface,
    i18n: I18n,
    storage: PersistencyProvider,
    secureStorage: SecurePersistencyProvider,
    exposureNotification: typeof ExposureNotification,
  ) {
    this.i18n = i18n;
    this.exposureNotification = exposureNotification;
    this.systemStatus = new Observable<SystemStatus>(SystemStatus.Undefined);
    this.exposureStatus = new MapObservable<ExposureStatus>({type: ExposureStatusType.Monitoring});
    this.backendInterface = backendInterface;
    this.storage = storage;
    this.secureStorage = secureStorage;
    this.exposureStatus.observe(status => {
      this.storage.setItem(EXPOSURE_STATUS, JSON.stringify(status));
    });

    if (Platform.OS === 'android') {
      DeviceEventEmitter.removeAllListeners('initiateExposureCheckEvent');
      DeviceEventEmitter.addListener('initiateExposureCheckEvent', this.initiateExposureCheckEvent);
      DeviceEventEmitter.removeAllListeners('executeExposureCheckEvent');
      DeviceEventEmitter.addListener('executeExposureCheckEvent', this.executeExposureCheckEvent);
    }
  }

  initiateExposureCheckEvent = async () => {
    if (Platform.OS !== 'android') return;
    log.debug({category: 'background', message: 'initiateExposureCheckEvent'});
    await this.initiateExposureCheck();
  };

  initiateExposureCheckHeadless = async () => {
    if (Platform.OS !== 'android') return;
    log.debug({category: 'background', message: 'initiateExposureCheckHeadless'});
    await this.initiateExposureCheck();
  };

  initiateExposureCheck = async () => {
    if (Platform.OS !== 'android') return;
    if (!(await this.shouldPerformExposureCheck())) return;

    const payload: NotificationPayload = {
      alertTitle: this.i18n.translate('Notification.ExposureChecksTitle'),
      alertBody: this.i18n.translate('Notification.ExposureChecksBody'),
      channelName: this.i18n.translate('Notification.ExposureChecksAndroidChannelName'),
      disableSound: true,
    };
    await ExposureCheckScheduler.executeExposureCheck(payload);
  };

  executeExposureCheckEvent = async () => {
    if (Platform.OS !== 'android') return;
    log.debug({category: 'background', message: 'executeExposureCheckEvent'});
    try {
      await this.updateExposureStatusInBackground();
    } catch (error) {
      // Noop
      log.error({category: 'background', message: 'executeExposureCheckEvent', error});
    }
  };

  async start(): Promise<{success: boolean; error?: string}> {
    if (this.starting) {
      return {success: true};
    }

    this.starting = true;

    try {
      await this.loadExposureStatus();
      if (Platform.OS === 'ios') {
        await this.exposureNotification.activate();
      }
      await this.exposureNotification.start();
      await this.updateSystemStatus();
      this.starting = false;
      return {success: true};
    } catch (error) {
      this.starting = false;
      await this.updateSystemStatus();

      log.debug({message: 'failed to start framework', payload: error});

      if (error.message === 'API_NOT_CONNECTED') {
        return {success: false, error: 'API_NOT_CONNECTED'};
      }

      return {success: false, error};
    }
  }

  async stop(): Promise<boolean> {
    if (this.stopping) {
      return true;
    }

    this.stopping = true;

    try {
      captureMessage('Called stop EN framework');
      await this.exposureNotification.stop();
    } catch (error) {
      captureException('Cannot stop EN framework', error);
      return false;
    }

    captureMessage('Called stop + updateSystem Status EN framework');
    await this.updateSystemStatus();

    this.stopping = false;
    return true;
  }

  async updateSystemStatus(): Promise<void> {
    const status = await this.exposureNotification.getStatus();
    this.systemStatus.set(status);
  }

  async updateExposureStatusInBackground() {
    // @todo: maybe remove this gets called in updateExposureStatus
    if (!(await this.shouldPerformExposureCheck())) return;
    await this.loadExposureStatus();
    try {
      await this.updateExposureStatus();
      await this.processNotification();

      const exposureStatus = this.exposureStatus.get();
      log.debug({
        category: 'exposure-check',
        message: 'updatedExposureStatusInBackground',
        payload: {exposureStatus},
      });
    } catch (error) {
      log.error({category: 'exposure-check', message: 'updateExposureStatusInBackground', error});
    }
  }

  /*
    Filter and sort the summaries.
    This may change in the future because of EN Framework changes.
  */
  public findSummariesContainingExposures(
    minimumExposureDurationMinutes: number,
    summaries: ExposureSummary[],
  ): ExposureSummary[] {
    return summaries
      .filter(summary => {
        return summary.matchedKeyCount > 0;
      })
      .filter(summary => {
        return this.summaryExceedsMinimumMinutes(summary, minimumExposureDurationMinutes);
      })
      .sort((summary1, summary2) => {
        return summary2.lastExposureTimestamp - summary1.lastExposureTimestamp;
      });
  }

  public isReminderNeeded(exposureStatus: ExposureStatus) {
    if (exposureStatus.type !== ExposureStatusType.Diagnosed) {
      return false;
    }

    if (!exposureStatus.needsSubmission) {
      return false;
    }

    if (!exposureStatus.uploadReminderLastSentAt) {
      return true;
    }

    const lastSent = new Date(exposureStatus.uploadReminderLastSentAt);
    const today = getCurrentDate();
    const mins = minutesBetween(lastSent, today);
    return mins > MINIMUM_REMINDER_INTERVAL_MINUTES;
  }

  public getPeriodsSinceLastFetch = (_lastCheckedPeriod?: number): number[] => {
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

  async updateCycleTimes(contagiousDateInfo: ContagiousDateInfo): Promise<void> {
    if (contagiousDateInfo.dateType === ContagiousDateType.None) {
      return;
    }
    if (contagiousDateInfo.date === null) {
      return;
    }
    const cycleStartsAt = contagiousDateInfo.date;
    const cycleEndsAt = addDays(cycleStartsAt, EXPOSURE_NOTIFICATION_CYCLE);
    this.finalize({
      cycleStartsAt: cycleStartsAt.getTime(),
      cycleEndsAt: cycleEndsAt.getTime(),
    });
  }

  async updateExposureStatus(forceCheck = false): Promise<void> {
    log.debug({
      category: 'exposure-check',
      message: 'updateExposureStatus',
    });
    if (!forceCheck && !(await this.shouldPerformExposureCheck())) return;
    if (this.exposureStatusUpdatePromise) return this.exposureStatusUpdatePromise;
    const cleanUpPromise = <T>(input: T): T => {
      this.exposureStatusUpdatePromise = null;
      return input;
    };
    switch (EN_API_VERSION) {
      case '2':
        captureMessage('updateExposureStatus', {message: 'Using API 2'});
        this.exposureStatusUpdatePromise = this.performExposureStatusUpdateV2().then(cleanUpPromise, cleanUpPromise);
        break;
      default:
        captureMessage('updateExposureStatus', {message: 'Using API 1'});
        this.exposureStatusUpdatePromise = this.performExposureStatusUpdate().then(cleanUpPromise, cleanUpPromise);
        break;
    }

    return this.exposureStatusUpdatePromise;
  }

  async isUploading(): Promise<boolean> {
    const exposureStatus: ExposureStatus = this.exposureStatus.get();
    if (exposureStatus.type !== ExposureStatusType.Diagnosed) return false;

    return exposureStatus.isUploading;
  }

  async setUploadStatus(status: boolean): Promise<void> {
    this.exposureStatus.append({isUploading: status});
  }

  async startKeysSubmission(oneTimeCode: string): Promise<void> {
    const keys = await this.backendInterface.claimOneTimeCode(oneTimeCode);
    const serialized = JSON.stringify(keys);
    try {
      await this.secureStorage.set(SUBMISSION_AUTH_KEYS, serialized, {});
    } catch (error) {
      captureException('Unable to store SUBMISSION_AUTH_KEYS', error);
    }
    const cycleStartsAt = getCurrentDate();
    this.exposureStatus.append({
      type: ExposureStatusType.Diagnosed,
      needsSubmission: true,
      hasShared: false,
      cycleStartsAt: cycleStartsAt.getTime(),
      cycleEndsAt: addDays(cycleStartsAt, EXPOSURE_NOTIFICATION_CYCLE).getTime(),
    });
  }

  async fetchAndSubmitKeys(contagiousDateInfo: ContagiousDateInfo): Promise<void> {
    const submissionKeysStr = await this.secureStorage.get(SUBMISSION_AUTH_KEYS);
    if (!submissionKeysStr) {
      throw new Error('Submission keys: bad certificate');
    }
    const auth = JSON.parse(submissionKeysStr) as SubmissionKeySet;

    let temporaryExposureKeys: TemporaryExposureKey[];

    try {
      temporaryExposureKeys = await this.exposureNotification.getTemporaryExposureKeyHistory();
    } catch (error) {
      captureException('getTemporaryExposureKeyHistory', error);
      throw cannotGetTEKsError;
    }
    if (temporaryExposureKeys.length > 0) {
      captureMessage('getTemporaryExposureKeyHistory', temporaryExposureKeys);
      await this.backendInterface.reportDiagnosisKeys(auth, temporaryExposureKeys, contagiousDateInfo);
    } else {
      captureMessage('getTemporaryExposureKeyHistory', {message: 'No TEKs available to upload'});
    }

    await this.recordKeySubmission();
    await this.updateCycleTimes(contagiousDateInfo);
  }

  public calculateNeedsSubmission(): boolean {
    const exposureStatus: ExposureStatus = this.exposureStatus.get();
    const today: Date = getCurrentDate();

    if (exposureStatus === null || today === null) return false;
    if (exposureStatus.type !== ExposureStatusType.Diagnosed) return false;

    if (isNaN(today.getTime())) return true;

    const cycleEndsAt = new Date(exposureStatus.cycleEndsAt);
    if (isNaN(cycleEndsAt.getTime()) === false) {
      // We're done submitting keys
      // This has to be based on UTC timezone https://github.com/cds-snc/covid-shield-mobile/issues/676
      if (daysBetweenUTC(today, cycleEndsAt) <= 0) return false;
    }

    const submissionLastCompletedAt = exposureStatus.submissionLastCompletedAt;
    if (!submissionLastCompletedAt) {
      return true;
    }

    const lastSubmittedDay = new Date(submissionLastCompletedAt);

    if (isNaN(lastSubmittedDay.getTime())) return true;

    // This has to be based on UTC timezone https://github.com/cds-snc/covid-shield-mobile/issues/676
    return daysBetweenUTC(lastSubmittedDay, today) > 0;
  }

  public updateExposure(): ExposureStatus {
    const exposureStatus: ExposureStatus = this.exposureStatus.get();
    const today: Date = getCurrentDate();

    switch (exposureStatus.type) {
      case ExposureStatusType.Diagnosed:
        // There is a case where using UTC and device timezone could mess up user experience. See `date-fn.spec.ts`
        // Let's use device timezone for resetting exposureStatus for now
        // Ref https://github.com/cds-snc/covid-shield-mobile/issues/676
        if (daysBetween(today, new Date(exposureStatus.cycleEndsAt)) <= 0) {
          return {type: ExposureStatusType.Monitoring, lastChecked: exposureStatus.lastChecked};
        } else {
          return {
            ...exposureStatus,
            needsSubmission: this.calculateNeedsSubmission(),
          };
        }
      case ExposureStatusType.Exposed:
        if (
          daysBetween(new Date(exposureStatus.summary.lastExposureTimestamp || today.getTime()), today) >=
          EXPOSURE_NOTIFICATION_CYCLE
        ) {
          return {type: ExposureStatusType.Monitoring, lastChecked: exposureStatus.lastChecked};
        } else {
          return exposureStatus;
        }
      default:
        // return the unchanged exposureStatus
        return exposureStatus;
    }
  }

  async clearExposedStatus() {
    const exposureStatus: ExposureStatus = this.exposureStatus.get();
    if (exposureStatus.type === ExposureStatusType.Exposed) {
      const summary = exposureStatus.summary;
      const summaries = exposureStatus.ignoredSummaries ? exposureStatus.ignoredSummaries : [];
      summaries.push(summary);
      return this.finalize({type: ExposureStatusType.Monitoring, ignoredSummaries: summaries});
    }

    return this.finalize();
  }

  public getTotalSeconds = (scanInstances: ScanInstance[]) => {
    const totalSeconds = scanInstances
      .map(scan => scan.secondsSinceLastScan)
      // with initial value to avoid when the array is empty
      .reduce((partialSum, x) => partialSum + x, 0);
    return totalSeconds;
  };

  public getAttenuationDurations = (scanInstances: ScanInstance[], attenuationDurationThresholds: number[]) => {
    //  typicalAttenuation values are in positive DB units
    const immediateScans = scanInstances.filter(scan => scan.typicalAttenuation <= attenuationDurationThresholds[0]);
    const nearScans = scanInstances.filter(scan => {
      return (
        scan.typicalAttenuation > attenuationDurationThresholds[0] &&
        scan.typicalAttenuation <= attenuationDurationThresholds[1]
      );
    });
    const farScans = scanInstances.filter(scan => scan.typicalAttenuation > attenuationDurationThresholds[1]);
    return [this.getTotalSeconds(immediateScans), this.getTotalSeconds(nearScans), this.getTotalSeconds(farScans)];
  };

  public async checkIfExposedV2({
    exposureWindows,
    attenuationDurationThresholds,
    minimumExposureDurationMinutes,
  }: {
    exposureWindows: ExposureWindow[];
    attenuationDurationThresholds: number[];
    minimumExposureDurationMinutes: number;
  }): Promise<[boolean, ExposureSummary | undefined]> {
    if (exposureWindows.length === 0) {
      return [false, undefined];
    }
    const dailySummariesObj: {[key: string]: {attenuationDurations: number[]; matchedKeyCount: number}} = {};
    exposureWindows
      .filter(window => {
        return window.infectiousness !== Infectiousness.None;
      })
      .map(window => {
        dailySummariesObj[window.day.toString()] = {attenuationDurations: [0, 0, 0], matchedKeyCount: 0};
        return {
          day: window.day,
          attenuationDurations: this.getAttenuationDurations(window.scanInstances, attenuationDurationThresholds),
        };
      })
      .forEach(windowSummary => {
        const dayString = windowSummary.day.toString();
        dailySummariesObj[dayString].attenuationDurations[0] += windowSummary.attenuationDurations[0];
        dailySummariesObj[dayString].attenuationDurations[1] += windowSummary.attenuationDurations[1];
        dailySummariesObj[dayString].attenuationDurations[2] += windowSummary.attenuationDurations[2];
        dailySummariesObj[dayString].matchedKeyCount += 1;
      });

    const dailySummaries = Object.entries(dailySummariesObj)
      .map(entry => {
        const dailySummary: ExposureSummary = {
          lastExposureTimestamp: Number(entry[0]),
          daysSinceLastExposure: -1 /* dummy value */,
          maximumRiskScore: -1 /* dummy value */,
          ...entry[1],
        };
        return dailySummary;
      })
      .sort((summary1, summary2) => {
        return summary2.lastExposureTimestamp - summary1.lastExposureTimestamp;
      });

    for (const dailySummary of dailySummaries) {
      const secondsOfExposure = dailySummary.attenuationDurations[0] + dailySummary.attenuationDurations[1];
      if (secondsOfExposure > minimumExposureDurationMinutes * 60) {
        return [true, dailySummary];
      }
    }
    return [false, undefined];
  }

  public async performExposureStatusUpdateV2(): Promise<any> {
    const exposureConfiguration = await this.getExposureConfiguration();
    const currentExposureStatus: ExposureStatus = this.exposureStatus.get();
    const updatedExposure = this.updateExposure();
    if (updatedExposure !== currentExposureStatus) {
      this.exposureStatus.set(updatedExposure);
      this.finalize();
    }

    if (updatedExposure.type === ExposureStatusType.Diagnosed) {
      return;
    }

    const {keysFileUrls, lastCheckedPeriod} = await this.getKeysFileUrls();
    captureMessage('keysFileUrls', keysFileUrls);
    try {
      let exposureWindows: ExposureWindow[];
      if (Platform.OS === 'android') {
        exposureWindows = await this.exposureNotification.getExposureWindowsAndroid(keysFileUrls);
      } else {
        const summaries = await this.exposureNotification.detectExposure(exposureConfiguration, keysFileUrls);
        if (summaries.length > 0) {
          exposureWindows = await this.exposureNotification.getExposureWindowsIos(summaries[0]);
        } else {
          exposureWindows = [];
        }
      }

      const [isExposed, dailySummary] = await this.checkIfExposedV2({
        exposureWindows,
        attenuationDurationThresholds: exposureConfiguration.attenuationDurationThresholds,
        minimumExposureDurationMinutes: exposureConfiguration.minimumExposureDurationMinutes,
      });
      if (isExposed) {
        return this.finalize(
          {
            type: ExposureStatusType.Exposed,
            summary: dailySummary,
          },
          lastCheckedPeriod,
        );
      }
      return this.finalize({}, lastCheckedPeriod);
    } catch (error) {
      captureException('performExposureStatusUpdateV2', error);
      return false;
    }
  }

  public shouldPerformExposureCheck = async () => {
    const today = getCurrentDate();
    const exposureStatus = this.exposureStatus.get();
    const onboardedDatetime = await this.storage.getItem(Key.OnboardedDatetime);

    if (!onboardedDatetime) {
      log.debug({
        category: 'exposure-check',
        message: 'shouldPerformExposureCheck',
        payload: {
          result: 'no',
          reason: 'onboardedDateTime',
        },
      });
      return false;
    }

    const lastCheckedTimestamp = exposureStatus.lastChecked?.timestamp;
    if (lastCheckedTimestamp) {
      const lastCheckedDate = new Date(lastCheckedTimestamp);
      const minutes = Math.ceil(minutesBetween(lastCheckedDate, today));
      if (minutes < PERIODIC_TASK_INTERVAL_IN_MINUTES) {
        log.debug({
          category: 'exposure-check',
          message: 'shouldPerformExposureCheck',
          payload: {
            minutesSinceLastCheck: minutes,
            taskInterval: PERIODIC_TASK_INTERVAL_IN_MINUTES,
            lastCheckedTimestamp,
            result: 'no',
            reason: 'minutes',
            onboardedDatetime,
          },
        });
        return false;
      } else {
        log.debug({
          category: 'exposure-check',
          message: 'shouldPerformExposureCheck',
          payload: {
            minutesSinceLastCheck: minutes,
            taskInterval: PERIODIC_TASK_INTERVAL_IN_MINUTES,
            lastCheckedTimestamp,
            result: 'yes',
            reason: 'minutes',
            onboardedDatetime,
          },
        });
        return true;
      }
    }
    log.debug({
      category: 'exposure-check',
      message: 'shouldPerformExposureCheck',
      payload: {
        taskInterval: PERIODIC_TASK_INTERVAL_IN_MINUTES,
        result: 'yes',
        reason: 'lastCheckedTimestamp - null',
        onboardedDatetime,
      },
    });
    return true;
  };

  public getExposureDetectedAt(): number | undefined {
    const exposureStatus = this.exposureStatus.get();
    let timeStamp;

    if (exposureStatus.type === ExposureStatusType.Exposed && exposureStatus.exposureDetectedAt) {
      timeStamp = exposureStatus.exposureDetectedAt;
    }

    return timeStamp;
  }

  public isIgnoredSummary(summary: ExposureSummary): boolean {
    const exposureStatus = this.exposureStatus.get();

    const matches = exposureStatus.ignoredSummaries?.filter((ignoredSummary: ExposureSummary) => {
      const daysBetween = daysBetweenUTC(
        new Date(ignoredSummary.lastExposureTimestamp),
        new Date(summary.lastExposureTimestamp),
      );

      log.debug({
        category: 'summary',
        message: 'isIgnoredSummary',
        payload: {daysBetween, ignoredSummary: summary, matches},
      });

      // ignore summaries that are same day or older than ignored summary
      if (daysBetween <= 0) {
        return true;
      }
    });

    if (matches && matches.length >= 1) {
      return true;
    }

    return false;
  }

  public async performExposureStatusUpdate(): Promise<void> {
    log.debug({category: 'exposure-check', message: 'performExposureStatusUpdate'});

    const exposureConfiguration = await this.getExposureConfiguration();
    const hasPendingExposureSummary = await this.processPendingExposureSummary(exposureConfiguration);
    if (hasPendingExposureSummary) {
      return;
    }

    const currentExposureStatus: ExposureStatus = this.exposureStatus.get();
    const updatedExposure = this.updateExposure();
    if (updatedExposure !== currentExposureStatus) {
      this.exposureStatus.set(updatedExposure);
      this.finalize();
    }

    if (updatedExposure.type === ExposureStatusType.Diagnosed) {
      return;
    }

    const {keysFileUrls, lastCheckedPeriod} = await this.getKeysFileUrls();

    try {
      log.debug({category: 'exposure-check', message: 'detectExposure'});
      const summaries = await this.exposureNotification.detectExposure(exposureConfiguration, keysFileUrls);
      const summariesContainingExposures = this.findSummariesContainingExposures(
        exposureConfiguration.minimumExposureDurationMinutes,
        summaries,
      );
      if (summariesContainingExposures.length > 0) {
        const summary = this.selectExposureSummary(summariesContainingExposures[0]);

        if (updatedExposure.type === ExposureStatusType.Monitoring && !this.isIgnoredSummary(summary)) {
          return this.finalize(
            {
              type: ExposureStatusType.Exposed,
              summary,
              exposureDetectedAt: getCurrentDate().getTime(),
            },
            lastCheckedPeriod,
          );
        }
      }
      return this.finalize({}, lastCheckedPeriod);
    } catch (error) {
      log.error({category: 'exposure-check', message: 'performExposureStatusUpdate', error});
    }

    return this.finalize();
  }

  public processOTKNotSharedNotification() {
    const exposureStatus = this.exposureStatus.get();

    log.debug({message: 'processOTKNotSharedNotification', payload: exposureStatus});

    if (exposureStatus.type === ExposureStatusType.Diagnosed && !exposureStatus.hasShared) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.OTKNotSharedTitle'),
        alertBody: this.i18n.translate('Notification.OTKNotSharedBody'),
      });
    }
  }

  private async loadExposureStatus() {
    const exposureStatus = JSON.parse((await this.storage.getItem(EXPOSURE_STATUS)) || 'null');
    this.exposureStatus.append({...exposureStatus});
  }

  /**
   * If the exposureConfiguration is not available from the server for some reason,
   * try and use a previously stored configuration, or use the default configuration bundled with the app.
   */
  private async getAlternateExposureConfiguration(): Promise<ExposureConfiguration> {
    try {
      const exposureConfigurationStr = await this.storage.getItem(EXPOSURE_CONFIGURATION);
      if (exposureConfigurationStr) {
        return JSON.parse(exposureConfigurationStr);
      } else {
        throw new Error('Unable to use saved exposureConfiguration');
      }
    } catch (error) {
      log.error({
        category: 'configuration',
        message: 'Using default exposureConfiguration',
        error,
      });
      return exposureConfigurationDefault;
    }
  }

  private async recordKeySubmission() {
    const currentStatus = this.exposureStatus.get();
    if (currentStatus.type !== ExposureStatusType.Diagnosed) return;
    this.exposureStatus.append({
      needsSubmission: false,
      hasShared: true,
      submissionLastCompletedAt: getCurrentDate().getTime(),
    });
  }

  private summaryExceedsMinimumMinutes(summary: ExposureSummary, minimumExposureDurationMinutes: number) {
    // on ios attenuationDurations is in seconds, on android it is in minutes
    const divisor = Platform.OS === 'ios' ? 60 : 1;
    const durationAtImmediateMinutes = summary.attenuationDurations[0] / divisor;
    const durationAtNearMinutes = summary.attenuationDurations[1] / divisor;
    const exposureDurationMinutes = durationAtImmediateMinutes + durationAtNearMinutes;

    return minimumExposureDurationMinutes && Math.round(exposureDurationMinutes) >= minimumExposureDurationMinutes;
  }

  private finalize = async (
    status: Partial<ExposureStatus> = {},
    lastCheckedPeriod: number | undefined = undefined,
  ) => {
    const previousExposureStatus = this.exposureStatus.get();
    const timestamp = getCurrentDate().getTime();
    const period =
      lastCheckedPeriod === undefined
        ? status.lastChecked?.period || previousExposureStatus.lastChecked?.period || 0
        : lastCheckedPeriod;
    this.exposureStatus.append({
      ...status,
      lastChecked: {
        timestamp,
        period,
      },
    });
    const currentExposureStatus = this.exposureStatus.get();
    log.debug({
      category: 'debug',
      message: 'finalize',
      payload: {
        previousExposureStatus,
        currentExposureStatus,
      },
    });
  };

  private async getKeysFileUrls(): Promise<any> {
    const currentStatus = this.exposureStatus.get();
    const keysFileUrls: string[] = [];
    let lastCheckedPeriod = currentStatus.lastChecked?.period;
    const periodsSinceLastFetch = this.getPeriodsSinceLastFetch(lastCheckedPeriod);
    try {
      for (const period of periodsSinceLastFetch) {
        const keysFileUrl = await this.backendInterface.retrieveDiagnosisKeys(period);
        keysFileUrls.push(keysFileUrl);
        lastCheckedPeriod = Math.max(lastCheckedPeriod || 0, period);
      }
    } catch (error) {
      captureException('Error while downloading key file', error);
    }
    return {keysFileUrls, lastCheckedPeriod};
  }

  private async processPendingExposureSummary(exposureConfiguration: ExposureConfiguration) {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type === ExposureStatusType.Diagnosed) {
      return false;
    }
    const summaries = await this.exposureNotification.getPendingExposureSummary().catch(error => {
      log.error({category: 'exposure-check', message: 'processPendingExposureSummary', error});
    });
    if (!summaries || summaries.length === 0) {
      log.info({category: 'exposure-check', message: 'processPendingExposureSummary - no summary'});
      return false;
    }
    const summariesContainingExposures = this.findSummariesContainingExposures(
      exposureConfiguration.minimumExposureDurationMinutes,
      summaries,
    );
    if (summariesContainingExposures.length === 0) {
      return false;
    }
    const today = getCurrentDate();
    this.exposureStatus.append({
      type: ExposureStatusType.Exposed,
      summary: this.selectExposureSummary(summariesContainingExposures[0]),
      lastChecked: {
        timestamp: today.getTime(),
        period: periodSinceEpoch(today, HOURS_PER_PERIOD),
      },
    });
    return true;
  }

  private async getExposureConfiguration(): Promise<ExposureConfiguration> {
    let exposureConfiguration: ExposureConfiguration;
    try {
      exposureConfiguration = await this.backendInterface.getExposureConfiguration();
      new ExposureConfigurationValidator().validateExposureConfiguration(
        exposureConfiguration,
        exposureConfigurationSchema,
      );
      log.debug({
        category: 'configuration',
        message: 'Using downloaded exposureConfiguration.',
      });
      const serialized = JSON.stringify(exposureConfiguration);
      await this.storage.setItem(EXPOSURE_CONFIGURATION, serialized);
      log.debug({
        category: 'configuration',
        message: 'Saving exposure configuration to secure storage.',
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        log.error({
          category: 'configuration',
          message: 'JSON Parsing Error: Unable to parse downloaded exposureConfiguration',
          error,
        });
      } else if (error instanceof ExposureConfigurationValidationError) {
        log.error({
          category: 'configuration',
          message: 'JSON Schema Error',
          error,
        });
      } else {
        log.error({
          category: 'configuration',
          message: 'Network Error: Unable to download exposureConfiguration.',
          error,
        });
      }
      exposureConfiguration = await this.getAlternateExposureConfiguration();
    }
    return exposureConfiguration;
  }

  private selectExposureSummary(nextSummary: ExposureSummary): ExposureSummary {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type !== ExposureStatusType.Exposed) {
      log.debug({category: 'summary', message: 'selectExposureSummary', payload: {nextSummary}});
      return nextSummary;
    }
    const currentSummary = exposureStatus.summary;
    log.debug({category: 'summary', message: 'selectExposureSummary', payload: {currentSummary}});
    return currentSummary;
  }

  private async processNotification() {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type === ExposureStatusType.Exposed && !exposureStatus.notificationSent) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.ExposedMessageTitle'),
        alertBody: this.i18n.translate('Notification.ExposedMessageBody'),
      });
      await this.exposureStatus.append({
        notificationSent: true,
      });
    }
    if (this.isReminderNeeded(exposureStatus)) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.DailyUploadNotificationTitle'),
        alertBody: this.i18n.translate('Notification.DailyUploadNotificationBody'),
      });
      await this.exposureStatus.append({
        uploadReminderLastSentAt: new Date().getTime(),
      });
    }
  }
}
