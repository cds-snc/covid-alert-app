import {Platform} from 'react-native';
import ExposureNotification, {
  ExposureSummary,
  Status as SystemStatus,
  ExposureConfiguration,
} from 'bridge/ExposureNotification';
import PushNotification from 'bridge/PushNotification';
import {addDays, daysBetween, isSameUtcCalendarDate, periodSinceEpoch} from 'shared/date-fns';
import {I18n} from '@shopify/react-i18n';
import {Observable, MapObservable} from 'shared/Observable';
import {TEST_MODE} from 'env';

import {BackendInterface, SubmissionKeySet} from '../BackendService';

import defaultExposureConfiguration from './DefaultExposureConfiguration.json';

const SUBMISSION_AUTH_KEYS = 'submissionAuthKeys';
const EXPOSURE_CONFIGURATION = 'exposure-configuration';

const SECURE_OPTIONS = {
  sharedPreferencesName: 'covidShieldSharedPreferences',
  keychainService: 'covidShieldKeychain',
};
const SECURE_OPTIONS_FOR_CONFIGURATION = {...SECURE_OPTIONS, kSecAttrAccessible: 'kSecAttrAccessibleAlways'};

export const EXPOSURE_STATUS = 'exposureStatus';

export const HOURS_PER_PERIOD = 24;

export const EXPOSURE_NOTIFICATION_CYCLE = 14;

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
    await this.init();
    await this.updateExposureStatus();
    const currentStatus = this.exposureStatus.get();
    if (currentStatus.type === 'exposed' && !currentStatus.notificationSent) {
      PushNotification.presentLocalNotification({
        alertTitle: this.i18n.translate('Notification.ExposedMessageTitle'),
        alertBody: this.i18n.translate('Notification.ExposedMessageBody'),
      });
      await this.exposureStatus.append({
        notificationSent: true,
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
      const exposureConfigurationStr = await this.secureStorage.getItem(
        EXPOSURE_CONFIGURATION,
        SECURE_OPTIONS_FOR_CONFIGURATION,
      );
      console.info('Getting exposure configuration from iOS keychain.');
      if (exposureConfigurationStr) {
        console.warn('Using previously saved exposureConfiguration');
        return JSON.parse(exposureConfigurationStr);
      } else {
        throw new Error('Unable to use saved exposureConfiguration');
      }
    } catch (error) {
      console.warn('Using default exposureConfiguration.', error);
      return defaultExposureConfiguration;
    }
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

    if (isSameUtcCalendarDate(lastSubmittedDay, today)) return false;
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
    let exposureConfiguration: ExposureConfiguration;
    try {
      exposureConfiguration = await this.backendInterface.getExposureConfiguration();
      console.info('Using downloaded exposureConfiguration.');
      const serialized = JSON.stringify(exposureConfiguration);
      await this.secureStorage.setItem(EXPOSURE_CONFIGURATION, serialized, SECURE_OPTIONS_FOR_CONFIGURATION);
      console.info('Saving exposure configuration to iOS keychain.');
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('JSON Parsing error: Unable to parse downloaded exposureConfiguration.', error);
      } else {
        console.error('Netowrk error: Unable to download exposureConfiguration.', error);
      }
      exposureConfiguration = await this.getAlternateExposureConfiguration();
    }

    const finalize = async (status: Partial<ExposureStatus> = {}, lastCheckedPeriod = 0) => {
      const timestamp = new Date().getTime();
      this.exposureStatus.append({
        ...status,
        lastChecked: {
          timestamp,
          period: lastCheckedPeriod,
        },
      });
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
    const generator = this.keysSinceLastFetch(currentStatus.lastChecked?.period);
    let lastCheckedPeriod = currentStatus.lastChecked?.period;
    while (true) {
      const {value, done} = await generator.next();
      if (done) break;
      if (!value) continue;
      const {keysFileUrl, period} = value;
      keysFileUrls.push(keysFileUrl);

      // Temporarily disable lastCheckPeriod
      // Ref https://github.com/cds-snc/covid-shield-server/pull/158
      if (TEST_MODE) {
        continue;
      }

      // Temporarily disable persisting lastCheckPeriod on Android
      // Ref https://github.com/cds-snc/covid-shield-mobile/issues/453
      if (Platform.OS !== 'android') {
        lastCheckedPeriod = Math.max(lastCheckedPeriod || 0, period);
      }
    }

    try {
      const summary = await this.exposureNotification.detectExposure(exposureConfiguration, keysFileUrls);
      if (summary.matchedKeyCount > 0) {
        return finalize(
          {
            type: 'exposed',
            summary,
          },
          lastCheckedPeriod,
        );
      }
    } catch (error) {
      console.log('>>> DetectExposure', error);
    }

    return finalize({}, lastCheckedPeriod);
  }
}
