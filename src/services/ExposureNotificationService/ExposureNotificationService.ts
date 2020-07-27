import ExposureNotification, {
  ExposureSummary,
  Status as SystemStatus,
  ExposureConfiguration,
} from 'bridge/ExposureNotification';
import PushNotification from 'bridge/PushNotification';
import {addDays, periodSinceEpoch, minutesBetween, getCurrentDate, daysBetweenUTC, daysBetween} from 'shared/date-fns';
import {I18n} from 'locale';
import {Observable, MapObservable} from 'shared/Observable';
import {captureException, captureMessage} from 'shared/log';

import {BackendInterface, SubmissionKeySet} from '../BackendService';

import exposureConfigurationDefault from './ExposureConfigurationDefault.json';
import exposureConfigurationSchema from './ExposureConfigurationSchema.json';
import {ExposureConfigurationValidator, ExposureConfigurationValidationError} from './ExposureConfigurationValidator';

const SUBMISSION_AUTH_KEYS = 'submissionAuthKeys';
const EXPOSURE_CONFIGURATION = 'exposureConfiguration';

export const EXPOSURE_STATUS = 'exposureStatus';

export const HOURS_PER_PERIOD = 24;

export const EXPOSURE_NOTIFICATION_CYCLE = 14;

export const MINIMUM_REMINDER_INTERVAL_MINUTES = 180;

export {SystemStatus};

export type ExposureStatus =
  | {
      type: 'monitoring';
      lastChecked?: {
        period: number;
        timestamp: number;
      };
    }
  | {
      type: 'exposed';
      summary: ExposureSummary;
      notificationSent?: boolean;
      lastChecked?: {
        period: number;
        timestamp: number;
      };
    }
  | {
      type: 'diagnosed';
      needsSubmission: boolean;
      submissionLastCompletedAt?: number;
      uploadReminderLastSentAt?: number;
      cycleStartsAt: number;
      cycleEndsAt: number;
      lastChecked?: {
        period: number;
        timestamp: number;
      };
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
    this.exposureStatus = new MapObservable<ExposureStatus>({type: 'monitoring'});
    this.backendInterface = backendInterface;
    this.storage = storage;
    this.secureStorage = secureStorage;
    this.exposureStatus.observe(status => {
      this.storage.setItem(EXPOSURE_STATUS, JSON.stringify(status));
    });
  }

  async start(): Promise<void> {
    if (this.starting) {
      return;
    }

    this.starting = true;

    await this.init();

    try {
      await this.exposureNotification.start();
    } catch (error) {
      captureException('Cannot start EN framework', error);
    }

    await this.updateSystemStatus();

    this.starting = false;
    await this.updateExposureStatus();
  }

  async updateSystemStatus(): Promise<void> {
    const status = await this.exposureNotification.getStatus();
    this.systemStatus.set(status);
  }

  async updateExposureStatusInBackground() {
    await this.init();
    try {
      captureMessage('updateExposureStatusInBackground', {exposureStatus: this.exposureStatus.get()});
      await this.processPendingExposureSummary();
      await this.processNotification();
      await this.updateExposureStatus();
      await this.processNotification();
      captureMessage('updatedExposureStatusInBackground', {exposureStatus: this.exposureStatus.get()});
    } catch (error) {
      captureException('updateExposureStatusInBackground', error);
    }
  }

  async updateExposureStatus(): Promise<void> {
    if (this.exposureStatusUpdatePromise) return this.exposureStatusUpdatePromise;
    const cleanUpPromise = <T>(input: T): T => {
      this.exposureStatusUpdatePromise = null;
      return input;
    };
    this.exposureStatusUpdatePromise = this.performExposureStatusUpdate().then(cleanUpPromise, cleanUpPromise);
    return this.exposureStatusUpdatePromise;
  }

  async startKeysSubmission(oneTimeCode: string): Promise<void> {
    const keys = await this.backendInterface.claimOneTimeCode(oneTimeCode);
    const serialized = JSON.stringify(keys);
    console.log(serialized);
    try {
      await this.secureStorage.set(SUBMISSION_AUTH_KEYS, serialized, {});
    } catch (error) {
      console.error(error);
    }
    const cycleStartsAt = getCurrentDate();
    this.exposureStatus.append({
      type: 'diagnosed',
      needsSubmission: true,
      cycleStartsAt: cycleStartsAt.getTime(),
      cycleEndsAt: addDays(cycleStartsAt, EXPOSURE_NOTIFICATION_CYCLE).getTime(),
    });
  }

  async fetchAndSubmitKeys(): Promise<void> {
    const submissionKeysStr = await this.secureStorage.get(SUBMISSION_AUTH_KEYS);
    if (!submissionKeysStr) {
      throw new Error('No Upload keys found, did you forget to claim one-time code?');
    }
    const auth = JSON.parse(submissionKeysStr) as SubmissionKeySet;
    const diagnosisKeys = await this.exposureNotification.getTemporaryExposureKeyHistory();
    if (diagnosisKeys.length > 0) {
      await this.backendInterface.reportDiagnosisKeys(auth, diagnosisKeys);
    }
    await this.recordKeySubmission();
  }

  private async init() {
    const exposureStatus = JSON.parse((await this.storage.getItem(EXPOSURE_STATUS)) || 'null');
    this.exposureStatus.append({...exposureStatus});
  }

  /**
   * If the exposureConfiguration is not available from the server for some reason,
   * try and use a previously stored configuration, or use the default configuration bundled with the app.
   */
  private async getAlternateExposureConfiguration(): Promise<ExposureConfiguration> {
    try {
      captureMessage('Getting exposure configuration from secure storage.');
      const exposureConfigurationStr = await this.storage.getItem(EXPOSURE_CONFIGURATION);
      if (exposureConfigurationStr) {
        return JSON.parse(exposureConfigurationStr);
      } else {
        throw new Error('Unable to use saved exposureConfiguration');
      }
    } catch (error) {
      captureException('Using default exposureConfiguration', error);
      return exposureConfigurationDefault;
    }
  }

  private async recordKeySubmission() {
    const currentStatus = this.exposureStatus.get();
    if (currentStatus.type !== 'diagnosed') return;
    this.exposureStatus.append({needsSubmission: false, submissionLastCompletedAt: getCurrentDate().getTime()});
  }

  private async calculateNeedsSubmission(): Promise<boolean> {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type !== 'diagnosed') return false;

    const today = getCurrentDate();
    const cycleEndsAt = new Date(exposureStatus.cycleEndsAt);
    // We're done submitting keys
    // This has to be based on UTC timezone https://github.com/cds-snc/covid-shield-mobile/issues/676
    if (daysBetweenUTC(today, cycleEndsAt) <= 0) return false;

    const submissionLastCompletedAt = exposureStatus.submissionLastCompletedAt;
    if (!submissionLastCompletedAt) return true;

    const lastSubmittedDay = new Date(submissionLastCompletedAt);

    // This has to be based on UTC timezone https://github.com/cds-snc/covid-shield-mobile/issues/676
    if (daysBetweenUTC(lastSubmittedDay, today) > 0) return true;

    return false;
  }

  private async *keysSinceLastFetch(
    _lastCheckedPeriod?: number,
  ): AsyncGenerator<{keysFileUrl: string; period: number} | null> {
    const runningDate = getCurrentDate();
    let runningPeriod = periodSinceEpoch(runningDate, HOURS_PER_PERIOD);

    if (!_lastCheckedPeriod) {
      try {
        const keysFileUrl = await this.backendInterface.retrieveDiagnosisKeys(0);
        yield {keysFileUrl, period: runningPeriod};
      } catch (error) {
        captureException('Error while downloading batch files', error);
      }
      return;
    }

    const lastCheckedPeriod = Math.max(_lastCheckedPeriod - 1, runningPeriod - EXPOSURE_NOTIFICATION_CYCLE);

    while (runningPeriod > lastCheckedPeriod) {
      try {
        const keysFileUrl = await this.backendInterface.retrieveDiagnosisKeys(runningPeriod);
        const period = runningPeriod;
        yield {keysFileUrl, period};
      } catch (error) {
        captureException('Error while downloading key file', error);
      }

      runningPeriod -= 1;
    }
  }

  private async performExposureStatusUpdate(): Promise<void> {
    let exposureConfiguration: ExposureConfiguration;
    try {
      exposureConfiguration = await this.backendInterface.getExposureConfiguration();
      new ExposureConfigurationValidator().validateExposureConfiguration(
        exposureConfiguration,
        exposureConfigurationSchema,
      );
      captureMessage('Using downloaded exposureConfiguration.');
      const serialized = JSON.stringify(exposureConfiguration);
      await this.storage.setItem(EXPOSURE_CONFIGURATION, serialized);
      captureMessage('Saving exposure configuration to secure storage.');
    } catch (error) {
      if (error instanceof SyntaxError) {
        captureException('JSON Parsing Error: Unable to parse downloaded exposureConfiguration', error);
      } else if (error instanceof ExposureConfigurationValidationError) {
        captureException('JSON Schema Error: ', error);
      } else {
        captureException('Network Error: Unable to download exposureConfiguration.', error);
      }
      exposureConfiguration = await this.getAlternateExposureConfiguration();
    }

    const finalize = async (
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
      captureMessage('finalize', {
        previousExposureStatus,
        currentExposureStatus,
      });
    };

    const currentStatus = this.exposureStatus.get();

    if (currentStatus.type === 'diagnosed') {
      const today = getCurrentDate();
      const cycleEndsAt = new Date(currentStatus.cycleEndsAt);
      // There is a case where using UTC and device timezone could mess up user experience. See `date-fn.spec.ts`
      // Let's use device timezone for resetting exposureStatus for now
      // Ref https://github.com/cds-snc/covid-shield-mobile/issues/676
      if (daysBetween(today, cycleEndsAt) <= 0) {
        this.exposureStatus.set({type: 'monitoring', lastChecked: currentStatus.lastChecked});
        return finalize();
      }
      return finalize({needsSubmission: await this.calculateNeedsSubmission()});
    } else if (currentStatus.type === 'exposed') {
      const today = getCurrentDate();
      const lastExposureAt = new Date(currentStatus.summary.lastExposureTimestamp || today.getTime());
      if (daysBetween(lastExposureAt, today) >= EXPOSURE_NOTIFICATION_CYCLE) {
        this.exposureStatus.set({type: 'monitoring', lastChecked: currentStatus.lastChecked});
        return finalize();
      }
    }

    const keysFileUrls: string[] = [];
    const generator = this.keysSinceLastFetch(currentStatus.lastChecked?.period);
    let lastCheckedPeriod = currentStatus.lastChecked?.period;
    while (true) {
      const {value, done} = await generator.next();
      if (done) break;
      if (!value) continue;
      const {keysFileUrl, period} = value;
      keysFileUrls.push(keysFileUrl);
      lastCheckedPeriod = Math.max(lastCheckedPeriod || 0, period);
    }

    captureMessage('performExposureStatusUpdate', {
      keysFileUrls,
      lastCheckedPeriod,
      exposureConfiguration,
    });

    try {
      const summary = await this.exposureNotification.detectExposure(exposureConfiguration, keysFileUrls);
      captureMessage('summary', {summary});
      if (summary.matchedKeyCount > 0) {
        return finalize(
          {
            type: 'exposed',
            summary: this.selectExposureSummary(summary),
          },
          lastCheckedPeriod,
        );
      }
      return finalize({}, lastCheckedPeriod);
    } catch (error) {
      captureException('performExposureStatusUpdate', error);
    }

    return finalize();
  }

  private async processPendingExposureSummary() {
    const summary = await this.exposureNotification.getPendingExposureSummary().catch(() => undefined);
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type === 'diagnosed' || !summary || summary.matchedKeyCount <= 0) {
      return;
    }
    const today = getCurrentDate();
    this.exposureStatus.append({
      type: 'exposed',
      summary: this.selectExposureSummary(summary),
      lastChecked: {
        timestamp: today.getTime(),
        period: periodSinceEpoch(today, HOURS_PER_PERIOD),
      },
    });
  }

  private selectExposureSummary(nextSummary: ExposureSummary): ExposureSummary {
    const exposureStatus = this.exposureStatus.get();
    const currentSummary = exposureStatus.type === 'exposed' ? exposureStatus.summary : undefined;
    const currentLastExposureTimestamp = currentSummary?.lastExposureTimestamp || 0;
    const nextLastExposureTimestamp = nextSummary.lastExposureTimestamp || 0;
    return !currentSummary || nextLastExposureTimestamp > currentLastExposureTimestamp ? nextSummary : currentSummary;
  }

  private async processNotification() {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type === 'exposed' && !exposureStatus.notificationSent) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.ExposedMessageTitle'),
        alertBody: this.i18n.translate('Notification.ExposedMessageBody'),
      });
      await this.exposureStatus.append({
        notificationSent: true,
      });
    }
    if (
      exposureStatus.type === 'diagnosed' &&
      exposureStatus.needsSubmission &&
      (!exposureStatus.uploadReminderLastSentAt ||
        minutesBetween(new Date(exposureStatus.uploadReminderLastSentAt), new Date()) >
          MINIMUM_REMINDER_INTERVAL_MINUTES)
    ) {
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
