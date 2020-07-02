import ExposureNotification, {ExposureSummary, Status as SystemStatus} from 'bridge/ExposureNotification';
import PushNotification from 'bridge/PushNotification';
import {addDays, daysBetween, periodSinceEpoch} from 'shared/date-fns';
import {I18n} from '@shopify/react-i18n';
import {Observable, MapObservable} from 'shared/Observable';

import {BackendInterface, SubmissionKeySet} from '../BackendService';

const SUBMISSION_AUTH_KEYS = 'submissionAuthKeys';

const SECURE_OPTIONS = {
  sharedPreferencesName: 'covidShieldSharedPreferences',
  keychainService: 'covidShieldKeychain',
};

export const EXPOSURE_STATUS = 'exposureStatus';

export const HOURS_PER_PERIOD = 24;

export const EXPOSURE_NOTIFICATION_CYCLE = 14;

export {SystemStatus};

export type ExposureStatus =
  | {
      type: 'monitoring';
      lastCheckedPeriod?: number;
      lastCheckedTimestamp?: number;
    }
  | {
      type: 'exposed';
      summary: ExposureSummary;
      lastCheckedPeriod?: number;
      lastCheckedTimestamp?: number;
    }
  | {
      type: 'diagnosed';
      needsSubmission: boolean;
      submissionLastCompletedAt?: number;
      cycleStartsAt: number;
      cycleEndsAt: number;
      lastCheckedPeriod?: number;
      lastCheckedTimestamp?: number;
    };

export interface PersistencyProvider {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
}

export interface SecurePersistencyProvider {
  setItem(key: string, value: string, options: SecureStorageOptions): Promise<null>;
  getItem(key: string, options: SecureStorageOptions): Promise<string | null>;
}

export interface SecureStorageOptions {
  keychainService?: string;
  sharedPreferencesName?: string;
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

  async init() {
    const exposureStatus = JSON.parse((await this.storage.getItem(EXPOSURE_STATUS)) || 'null');
    this.exposureStatus.append({...exposureStatus});
  }

  async start(): Promise<void> {
    if (this.starting) {
      return;
    }
    this.starting = true;

    await this.init();

    try {
      await this.exposureNotification.start();
    } catch (_) {
      this.systemStatus.set(SystemStatus.Unknown);
      return;
    }

    await this.updateSystemStatus();
    await this.updateExposureStatus();

    this.starting = false;
  }

  async updateSystemStatus(): Promise<void> {
    const status = await this.exposureNotification.getStatus();
    this.systemStatus.set(status);
  }

  async updateExposureStatusInBackground() {
    const lastStatus = this.exposureStatus.get();
    await this.updateExposureStatus();
    const currentStatus = this.exposureStatus.get();
    if (lastStatus.type === 'monitoring' && currentStatus.type === 'exposed') {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.ExposedMessageTitle'),
        alertBody: this.i18n.translate('Notification.ExposedMessageBody'),
      });
    }
    if (currentStatus.type === 'diagnosed' && currentStatus.needsSubmission) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.DailyUploadNotificationTitle'),
        alertBody: this.i18n.translate('Notification.DailyUploadNotificationBody'),
      });
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
    await this.secureStorage.setItem(SUBMISSION_AUTH_KEYS, serialized, SECURE_OPTIONS);
    const cycleStartsAt = new Date();
    this.exposureStatus.append({
      type: 'diagnosed',
      needsSubmission: true,
      cycleStartsAt: cycleStartsAt.getTime(),
      cycleEndsAt: addDays(cycleStartsAt, EXPOSURE_NOTIFICATION_CYCLE).getTime(),
    });
  }

  async fetchAndSubmitKeys(): Promise<void> {
    const submissionKeysStr = await this.secureStorage.getItem(SUBMISSION_AUTH_KEYS, SECURE_OPTIONS);
    if (!submissionKeysStr) {
      throw new Error('No Upload keys found, did you forget to claim one-time code?');
    }
    const auth = JSON.parse(submissionKeysStr) as SubmissionKeySet;
    const diagnosisKeys = await this.exposureNotification.getTemporaryExposureKeyHistory();

    await this.backendInterface.reportDiagnosisKeys(auth, diagnosisKeys);
    await this.recordKeySubmission();
  }

  private async recordKeySubmission() {
    const currentStatus = this.exposureStatus.get();
    if (currentStatus.type !== 'diagnosed') return;
    this.exposureStatus.append({needsSubmission: false, submissionLastCompletedAt: new Date().getTime()});
  }

  private async calculateNeedsSubmission(): Promise<boolean> {
    const exposureStatus = this.exposureStatus.get();
    if (exposureStatus.type !== 'diagnosed') return false;

    const today = new Date();
    const cycleEndsAt = new Date(exposureStatus.cycleEndsAt);
    // we're done submitting keys
    if (daysBetween(today, cycleEndsAt) <= 0) return false;

    const submissionLastCompletedAt = exposureStatus.submissionLastCompletedAt;
    if (!submissionLastCompletedAt) return true;

    const lastSubmittedDay = new Date(submissionLastCompletedAt);
    if (daysBetween(lastSubmittedDay, today) > 0) return true;

    return false;
  }

  private async *keysSinceLastFetch(
    _lastCheckedPeriod?: number,
  ): AsyncGenerator<{keysFileUrl: string; period: number} | null> {
    const runningDate = new Date();

    const lastCheckedPeriod =
      _lastCheckedPeriod || periodSinceEpoch(addDays(runningDate, -EXPOSURE_NOTIFICATION_CYCLE), HOURS_PER_PERIOD);
    let runningPeriod = periodSinceEpoch(runningDate, HOURS_PER_PERIOD);

    while (runningPeriod > lastCheckedPeriod) {
      try {
        const keysFileUrl = await this.backendInterface.retrieveDiagnosisKeys(runningPeriod);
        const period = runningPeriod;
        yield {keysFileUrl, period};
      } catch (err) {
        console.log('>>> error while downloading key file:', err);
      }

      runningPeriod -= 1;
    }
  }

  private async performExposureStatusUpdate(): Promise<void> {
    const exposureConfiguration = await this.backendInterface.getExposureConfiguration();

    const finalize = async (status: Partial<ExposureStatus> = {}) => {
      const timestamp = new Date().getTime();
      this.exposureStatus.append({...status, lastCheckedTimestamp: timestamp});
    };

    const currentStatus = this.exposureStatus.get();

    if (currentStatus.type === 'diagnosed') {
      const today = new Date();
      const cycleEndsAt = new Date(currentStatus.cycleEndsAt);
      if (daysBetween(today, cycleEndsAt) <= 0) {
        this.exposureStatus.set({type: 'monitoring'});
        return finalize();
      }
      return finalize({needsSubmission: await this.calculateNeedsSubmission()});
    } else if (
      currentStatus.type === 'exposed' &&
      currentStatus.summary.daysSinceLastExposure >= EXPOSURE_NOTIFICATION_CYCLE
    ) {
      this.exposureStatus.set({type: 'monitoring'});
      return finalize();
    }

    const keysFileUrls: string[] = [];
    const generator = this.keysSinceLastFetch(currentStatus.lastCheckedPeriod);
    let lastCheckedPeriod = currentStatus.lastCheckedPeriod;
    while (true) {
      const {value, done} = await generator.next();
      if (done) break;
      if (!value) continue;
      const {keysFileUrl, period} = value;
      lastCheckedPeriod = Math.max(lastCheckedPeriod || 0, period);
      keysFileUrls.push(keysFileUrl);
    }

    try {
      const summary = await this.exposureNotification.detectExposure(exposureConfiguration, keysFileUrls);
      if (summary.matchedKeyCount > 0) {
        return finalize({type: 'exposed', summary, lastCheckedPeriod});
      }
    } catch (error) {
      console.log('>>> detectExposure', error);
    }

    return finalize({lastCheckedPeriod});
  }
}
