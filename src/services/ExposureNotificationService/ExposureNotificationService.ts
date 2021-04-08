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
import {
  addDays,
  periodSinceEpoch,
  minutesBetween,
  getCurrentDate,
  daysBetweenUTC,
  daysBetween,
  parseSavedTimestamps,
  secondsBetween,
} from 'shared/date-fns';
import {I18n} from 'locale';
import {Observable, MapObservable} from 'shared/Observable';
import {captureException, captureMessage} from 'shared/log';
import {log} from 'shared/logging/config';
import {DeviceEventEmitter, Platform} from 'react-native';
import {ContagiousDateInfo, ContagiousDateType} from 'shared/DataSharing';
import {EN_API_VERSION} from 'env';
import {checkNotifications} from 'react-native-permissions';
import {Status} from 'shared/NotificationPermissionStatus';
import {PollNotifications} from 'services/PollNotificationService';
import {OutbreakService} from 'shared/OutbreakProvider';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';
import {publishDebugMetric} from 'bridge/DebugMetrics';

import {BackendInterface, SubmissionKeySet} from '../BackendService';
import {PERIODIC_TASK_INTERVAL_IN_MINUTES} from '../BackgroundSchedulerService';
import {StorageService, StorageDirectory} from '../StorageService';
import ExposureCheckScheduler from '../../bridge/ExposureCheckScheduler';

import exposureConfigurationDefault from './ExposureConfigurationDefault.json';
import exposureConfigurationSchema from './ExposureConfigurationSchema.json';
import {ExposureConfigurationValidator, ExposureConfigurationValidationError} from './ExposureConfigurationValidator';
import {doesPlatformSupportV2} from './ExposureNotificationServiceUtils';

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
      exposureDetectedAt: number;
      notificationSent?: boolean;
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

export class ExposureNotificationService {
  systemStatus: Observable<SystemStatus>;
  exposureStatus: MapObservable<ExposureStatus>;
  exposureHistory: Observable<number[]>;

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
  private storageService: StorageService;

  private filteredMetricsService: FilteredMetricsService;

  constructor(
    backendInterface: BackendInterface,
    i18n: I18n,
    storageService: StorageService,
    exposureNotification: typeof ExposureNotification,
    filteredMetricsService: FilteredMetricsService,
  ) {
    this.i18n = i18n;
    this.exposureNotification = exposureNotification;
    this.systemStatus = new Observable<SystemStatus>(SystemStatus.Undefined);
    this.exposureStatus = new MapObservable<ExposureStatus>({type: ExposureStatusType.Monitoring});
    this.exposureHistory = new Observable<number[]>([]);
    this.backendInterface = backendInterface;
    this.storageService = storageService;
    this.filteredMetricsService = filteredMetricsService;
    this.exposureStatus.observe(status => {
      this.storageService.save(StorageDirectory.ExposureNotificationServiceExposureStatusKey, JSON.stringify(status));
    });
    this.exposureHistory.observe(history => {
      this.storageService.save(StorageDirectory.ExposureNotificationServiceExposureHistoryKey, history.join(','));
    });

    if (Platform.OS === 'android') {
      DeviceEventEmitter.removeAllListeners('initiateExposureCheckEvent');
      DeviceEventEmitter.addListener('initiateExposureCheckEvent', this.initiateExposureCheckEvent);
      DeviceEventEmitter.removeAllListeners('executeExposureCheckEvent');
      DeviceEventEmitter.addListener('executeExposureCheckEvent', this.executeExposureCheckEvent);
    }
  }

  initiateExposureCheckEvent = async () => {
    publishDebugMetric(4.1);
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
    publishDebugMetric(5.0);
    if (Platform.OS !== 'android') return;
    if (!(await this.shouldPerformExposureCheck())) return;

    const payload: NotificationPayload = {
      alertTitle: this.i18n.translate('Notification.ExposureChecksTitle'),
      alertBody: this.i18n.translate('Notification.ExposureChecksBody'),
      channelName: this.i18n.translate('Notification.ExposureChecksAndroidChannelName'),
      disableSound: true,
    };

    publishDebugMetric(6.0);
    await ExposureCheckScheduler.executeExposureCheck(payload);
  };

  executeExposureCheckEvent = async () => {
    await FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ActiveUser});

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
      await this.loadExposureHistory();
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
    const backgroundTaskStartDate = getCurrentDate();

    const logEndOfBackgroundTask = async (succeeded: boolean) => {
      const backgroundTaskDurationInSeconds = secondsBetween(backgroundTaskStartDate, getCurrentDate());
      log.debug({
        category: 'background',
        message: 'backgoundTaskDuration',
        payload: {succeeded, backgroundTaskDurationInSeconds},
      });

      await this.filteredMetricsService.addEvent({
        type: EventTypeMetric.BackgroundProcess,
        succeeded,
        durationInSeconds: backgroundTaskDurationInSeconds,
      });
    };

    // @todo: maybe remove this gets called in updateExposureStatus
    if (!(await this.shouldPerformExposureCheck())) return;

    try {
      await this.loadExposureStatus();
      await this.loadExposureHistory();
      await this.updateExposureStatus();
      await this.processNotification();
      const qrEnabled = (await this.storageService.retrieve(StorageDirectory.GlobalQrEnabledKey)) === '1';
      if (qrEnabled) {
        OutbreakService.sharedInstance(this.i18n).checkForOutbreaks();
      }

      const exposureStatus = this.exposureStatus.get();
      log.debug({
        category: 'exposure-check',
        message: 'updatedExposureStatusInBackground',
        payload: {exposureStatus},
      });

      PollNotifications.checkForNotifications(this.i18n);

      await logEndOfBackgroundTask(true);
    } catch (error) {
      await logEndOfBackgroundTask(false);
      log.error({category: 'exposure-check', message: 'updateExposureStatusInBackground', error});
    }

    const notificationStatus: Status = await checkNotifications()
      .then(({status}) => status)
      .catch(() => 'unavailable');
    await this.filteredMetricsService.sendDailyMetrics(this.systemStatus.get(), notificationStatus);
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
      payload: {forceCheck},
    });
    if (!forceCheck && !(await this.shouldPerformExposureCheck())) return;
    if (this.exposureStatusUpdatePromise) return this.exposureStatusUpdatePromise;
    const cleanUpPromise = <T>(input: T): T => {
      this.exposureStatusUpdatePromise = null;
      return input;
    };
    log.debug({category: 'exposure-check', message: 'updateExposureStatus', payload: {forceCheck}});
    if (EN_API_VERSION === '2' && doesPlatformSupportV2(Platform)) {
      this.exposureStatusUpdatePromise = this.performExposureStatusUpdateV2().then(cleanUpPromise, cleanUpPromise);
    } else {
      this.exposureStatusUpdatePromise = this.performExposureStatusUpdate().then(cleanUpPromise, cleanUpPromise);
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
      await this.storageService.save(StorageDirectory.ExposureNotificationServiceSubmissionAuthKeysKey, serialized);
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
    const submissionKeysStr = await this.storageService.retrieve(
      StorageDirectory.ExposureNotificationServiceSubmissionAuthKeysKey,
    );
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
          log.info({message: 'clearing exposure history'});
          this.exposureHistory.set([]);
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
      log.info({message: 'clearing exposure history'});
      this.exposureHistory.set([]);
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
        const dayInMs = Number(entry[0]);
        const dailySummary: ExposureSummary = {
          lastExposureTimestamp: dayInMs,
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

    log.debug({category: 'exposure-check', message: 'performExposureStatusUpdateV2', payload: {updatedExposure}});

    if (updatedExposure !== currentExposureStatus) {
      this.exposureStatus.set(updatedExposure);
      this.finalize();
    }

    if (updatedExposure.type === ExposureStatusType.Diagnosed) {
      return;
    }

    const {keysFileUrls, lastCheckedPeriod} = await this.getKeysFileUrls();

    try {
      let exposureWindows: ExposureWindow[];
      if (Platform.OS === 'android') {
        await this.exposureNotification.setDiagnosisKeysDataMapping();
        exposureWindows = await this.exposureNotification.getExposureWindowsAndroid(keysFileUrls);
      } else {
        exposureWindows = await this.exposureNotification.getExposureWindowsIos(exposureConfiguration, keysFileUrls);
      }

      await this.filteredMetricsService.addEvent({type: EventTypeMetric.BackgroundCheck});

      log.debug({
        category: 'exposure-check',
        message: 'performExposureStatusUpdateV2',
        payload: {'exposureWindows.length': exposureWindows.length, exposureWindows},
      });
      const [isExposed, summary] = await this.checkIfExposedV2({
        exposureWindows,
        attenuationDurationThresholds: exposureConfiguration.attenuationDurationThresholds,
        minimumExposureDurationMinutes: exposureConfiguration.minimumExposureDurationMinutes,
      });
      if (isExposed && summary !== undefined) {
        this.setExposed(summary, currentExposureStatus, lastCheckedPeriod);
        return;
      }
      return this.finalize({}, lastCheckedPeriod);
    } catch (error) {
      log.error({category: 'exposure-check', message: 'performExposureStatusUpdateV2', error});
    }

    return this.finalize();
  }

  public shouldPerformExposureCheck = async () => {
    const today = getCurrentDate();
    const exposureStatus = this.exposureStatus.get();
    const onboardedDatetime = await this.storageService.retrieve(StorageDirectory.GlobalOnboardedDatetimeKey);

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

  public getExposureDetectedAt(): Date[] {
    const exposureStatus = this.exposureStatus.get();
    log.info({category: 'exposure-check', message: 'getExposureDetectedAt', payload: {exposureStatus}});

    if (exposureStatus.type !== ExposureStatusType.Exposed) {
      return [];
    }
    const exposureHistory = this.exposureHistory.get();

    if (exposureHistory && exposureHistory.length > 0) {
      log.debug({message: 'exposureHistory', payload: exposureHistory});
      return exposureHistory.sort((ts1, ts2) => ts2 - ts1).map(ts => new Date(ts));
    }
    if (exposureStatus.exposureDetectedAt) {
      log.debug({message: 'exposureHistory', payload: {exposureDetectedAt: exposureStatus.exposureDetectedAt}});
      return [new Date(exposureStatus.exposureDetectedAt)];
    }
    return [];
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
    // @todo confirm how equality works here
    if (updatedExposure !== currentExposureStatus) {
      log.debug({
        category: 'exposure-check',
        message: 'performExposureStatusUpdate',
        payload: {
          status: '!=',
          updatedExposure,
          currentExposureStatus,
        },
      });
      this.exposureStatus.set(updatedExposure);
      this.finalize();
    }

    if (updatedExposure.type === ExposureStatusType.Diagnosed) {
      return;
    }

    const {keysFileUrls, lastCheckedPeriod} = await this.getKeysFileUrls();

    publishDebugMetric(6.1);

    try {
      const summaries = await this.exposureNotification.detectExposure(exposureConfiguration, keysFileUrls);

      await this.filteredMetricsService.addEvent({type: EventTypeMetric.BackgroundCheck});

      log.debug({
        category: 'exposure-check',
        message: 'detectExposure',
        payload: {summaries, history: this.exposureHistory},
      });
      const summariesContainingExposures = this.findSummariesContainingExposures(
        exposureConfiguration.minimumExposureDurationMinutes,
        summaries,
      );
      if (summariesContainingExposures.length > 0) {
        this.setExposed(summariesContainingExposures[0], updatedExposure, lastCheckedPeriod);
      }
      return this.finalize({}, lastCheckedPeriod);
    } catch (error) {
      log.error({category: 'exposure-check', message: 'performExposureStatusUpdate', error});
    }

    return this.finalize();
  }

  public async setExposed(
    nextSummary: ExposureSummary,
    currentExposureStatus: ExposureStatus,
    lastCheckedPeriod: number,
  ) {
    const {summary, isNext} = this.selectExposureSummary(nextSummary);
    if (this.isIgnoredSummary(summary)) {
      log.debug({
        category: 'exposure-check',
        message: 'ignored',
        payload: {nextSummary},
      });
      return this.finalize({}, lastCheckedPeriod);
    }

    this.filteredMetricsService.addEvent({
      type: EventTypeMetric.Exposed,
      isUserExposed: currentExposureStatus.type === ExposureStatusType.Exposed,
    });

    if (currentExposureStatus.type === ExposureStatusType.Monitoring) {
      return this.setExposureDetectedAt(summary, lastCheckedPeriod);
    }

    if (currentExposureStatus.type === ExposureStatusType.Exposed && isNext) {
      const exposureHistory = this.exposureHistory.get();
      if (exposureHistory.length === 0 && currentExposureStatus.exposureDetectedAt) {
        // an exposed person has upgraded the app and does not have exposure history set
        log.debug({category: 'exposure-check', message: 'backfilling missing exposure history'});
        exposureHistory.push(currentExposureStatus.exposureDetectedAt);
        this.exposureHistory.set(exposureHistory);
      }
      return this.setExposureDetectedAt(summary, lastCheckedPeriod);
    }
  }

  public processOTKNotSharedNotification() {
    const exposureStatus = this.exposureStatus.get();

    log.debug({message: 'processOTKNotSharedNotification', payload: exposureStatus});

    if (exposureStatus.type === ExposureStatusType.Diagnosed && !exposureStatus.hasShared) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.OTKNotSharedTitle'),
        alertBody: this.i18n.translate('Notification.OTKNotSharedBody'),
        channelName: this.i18n.translate('Notification.AndroidChannelName'),
      });
    }
  }

  public async setExposureDetectedAt(summary: ExposureSummary, lastCheckedPeriod: number) {
    const exposureDetectedAt = getCurrentDate().getTime();

    log.debug({
      category: 'exposure-check',
      message: 'setExposureDetectedAt',
      payload: {summary, exposureDetectedAt},
    });

    this.finalize(
      {
        type: ExposureStatusType.Exposed,
        summary,
        exposureDetectedAt,
      },
      lastCheckedPeriod,
    );
    const exposureHistory = this.exposureHistory.get();
    exposureHistory.push(exposureDetectedAt);
    this.exposureHistory.set(exposureHistory);
  }

  public selectExposureSummary(nextSummary: ExposureSummary): {summary: ExposureSummary; isNext: boolean} {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type !== ExposureStatusType.Exposed) {
      log.debug({
        category: 'summary',
        message: 'selectExposureSummary',
        payload: {nextSummary, isNext: true, reason: 'prev not exposed', history: this.exposureHistory},
      });
      return {summary: nextSummary, isNext: true};
    }
    const currentSummary = exposureStatus.summary;
    const currentSummaryDate = new Date(currentSummary.lastExposureTimestamp);
    const nextSummaryDate = new Date(nextSummary.lastExposureTimestamp);
    if (daysBetween(currentSummaryDate, nextSummaryDate) > 0) {
      log.debug({
        category: 'summary',
        message: 'selectExposureSummary',
        payload: {nextSummary, isNext: true, reason: daysBetween, history: this.exposureHistory},
      });
      return {summary: nextSummary, isNext: true};
    }

    log.debug({
      category: 'summary',
      message: 'selectExposureSummary',
      payload: {currentSummary, isNext: false, reason: 'default', history: this.exposureHistory},
    });

    return {summary: currentSummary, isNext: false};
  }

  private async loadExposureStatus() {
    const exposureStatus = JSON.parse(
      (await this.storageService.retrieve(StorageDirectory.ExposureNotificationServiceExposureStatusKey)) || 'null',
    );
    this.exposureStatus.append({...exposureStatus});
  }

  private async loadExposureHistory() {
    try {
      const _exposureHistory = await this.storageService.retrieve(
        StorageDirectory.ExposureNotificationServiceExposureHistoryKey,
      );
      if (!_exposureHistory) {
        log.debug({message: "'Unable to retrieve EXPOSURE_HISTORY"});
        return;
      }
      const exposureHistory = parseSavedTimestamps(_exposureHistory);
      log.debug({message: 'EXPOSURE_HISTORY', payload: exposureHistory});
      this.exposureHistory.set(exposureHistory);
    } catch (error) {
      log.debug({message: "'No EXPOSURE_HISTORY found"});
    }
  }

  /**
   * If the exposureConfiguration is not available from the server for some reason,
   * try and use a previously stored configuration, or use the default configuration bundled with the app.
   */
  private async getAlternateExposureConfiguration(): Promise<ExposureConfiguration> {
    try {
      const exposureConfigurationStr = await this.storageService.retrieve(
        StorageDirectory.ExposureNotificationServiceExposureConfigurationKey,
      );
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
    const lastCheckedPeriod = periodSinceEpoch(today, HOURS_PER_PERIOD);
    this.setExposed(summariesContainingExposures[0], exposureStatus, lastCheckedPeriod);
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
      await this.storageService.save(StorageDirectory.ExposureNotificationServiceExposureConfigurationKey, serialized);
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

  private async processNotification() {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type === ExposureStatusType.Exposed && !exposureStatus.notificationSent) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.ExposedMessageTitle'),
        alertBody: this.i18n.translate('Notification.ExposedMessageBody'),
        channelName: this.i18n.translate('Notification.AndroidChannelName'),
      });
      await this.exposureStatus.append({
        notificationSent: true,
      });
    }
    if (this.isReminderNeeded(exposureStatus)) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.DailyUploadNotificationTitle'),
        alertBody: this.i18n.translate('Notification.DailyUploadNotificationBody'),
        channelName: this.i18n.translate('Notification.AndroidChannelName'),
      });
      await this.exposureStatus.append({
        uploadReminderLastSentAt: getCurrentDate().getTime(),
      });
    }
  }
}
