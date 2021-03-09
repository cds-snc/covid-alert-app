import BackgroundFetch from 'react-native-background-fetch';
import {AppRegistry, Platform} from 'react-native';
import {HMAC_KEY, RETRIEVE_URL, SUBMIT_URL, TEST_MODE} from 'env';
import {FilteredMetricsService, EventTypeMetric} from 'services/MetricsService';
import ExposureNotification from 'bridge/ExposureNotification';
import {publishDebugMetric} from 'bridge/DebugMetrics';

import ExposureCheckScheduler from '../../bridge/ExposureCheckScheduler';
import {PeriodicWorkPayload} from '../../bridge/PushNotification';
import {log} from '../../shared/logging/config';
import {ExposureNotificationService} from '../ExposureNotificationService';
import {getCurrentDate, minutesBetween} from '../../shared/date-fns';
import {DefaultFutureStorageService} from '../StorageService';
import {BackendService} from '../BackendService';
import {createBackgroundI18n} from '../../locale';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

export const PERIODIC_TASK_INTERVAL_IN_MINUTES = TEST_MODE ? 15 : 240;
export const PERIODIC_TASK_DELAY_IN_MINUTES = TEST_MODE ? 1 : PERIODIC_TASK_INTERVAL_IN_MINUTES + 5;

const registerPeriodicTask = async (task: PeriodicTask, exposureNotificationService?: ExposureNotificationService) => {
  publishDebugMetric(0);
  if (Platform.OS === 'ios') {
    // iOS only
    BackgroundFetch.configure(
      {
        minimumFetchInterval: PERIODIC_TASK_INTERVAL_IN_MINUTES,
        forceAlarmManager: false,
        enableHeadless: true,
        startOnBoot: true,
        stopOnTerminate: false,
      },
      async taskId => {
        // All background tasks come through this same callback
        switch (taskId) {
          default: {
            log.debug({
              category: 'background',
              message: `runPeriodicTask: ${taskId}`,
            });
            try {
              await task();
            } catch (error) {
              log.error({
                category: 'background',
                message: 'runPeriodicTask',
                error,
              });
            }
          }
        }
        BackgroundFetch.finish(taskId);
      },
    );
    const result = await BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true}).catch(
      () => false,
    );
    log.debug({
      category: 'background',
      message: `registerPeriodicTask: ${result}`,
    });
  } else {
    // Android only
    let delay = PERIODIC_TASK_DELAY_IN_MINUTES;
    if (exposureNotificationService) {
      const today = getCurrentDate();
      const exposureStatus = exposureNotificationService.exposureStatus.get();
      const lastCheckedTimestamp = exposureStatus.lastChecked?.timestamp;
      if (lastCheckedTimestamp) {
        const lastCheckedDate = new Date(lastCheckedTimestamp);
        const minutesSinceLastCheck = Math.ceil(minutesBetween(lastCheckedDate, today));
        if (minutesSinceLastCheck < delay) {
          delay -= minutesSinceLastCheck;
        }
      }
    }
    const payload: PeriodicWorkPayload = {
      initialDelay: delay,
      repeatInterval: PERIODIC_TASK_INTERVAL_IN_MINUTES,
    };
    log.debug({
      category: 'background',
      message: 'registerPeriodicTask - Android',
      payload: {
        ...payload,
        exposureNotificationService,
      },
    });
    await ExposureCheckScheduler.scheduleExposureCheck(payload);
  }
};

/**
 * @deprecated Replaced by `registerAndroidHeadlessExposureCheckPeriodicTask`
 *             - transitioning from using BackgroundFetch to WorkManager
 *             - this function will still be called when upgrading from v.1.1.3 or below
 *             - `task` is passed in as a legacy parameter, but is no longer used within the function
 */
// @ts-ignore
const registerAndroidHeadlessPeriodicTask = (task: PeriodicTask) => {
  if (Platform.OS !== 'android') {
    return;
  }
  // BackgroundFetch is still used, only to register the headless task.
  // Scheduling the periodic task itself handled by ExposureCheckScheduler
  BackgroundFetch.registerHeadlessTask(async ({taskId}) => {
    log.debug({
      category: 'background',
      message: `runAndroidHeadlessPeriodicTask: ${taskId}`,
    });
    try {
      log.debug({
        category: 'background',
        message: 'registerHeadlessTask: WorkManager',
      });
      // Stop and remove legacy periodic tasks that were scheduled using react-native-background-fetch
      await BackgroundFetch.stop('react-native-background-fetch');

      // Setup new periodic task to use WorkManager
      const backendService = new BackendService(
        RETRIEVE_URL,
        SUBMIT_URL,
        HMAC_KEY,
        DefaultFutureStorageService.sharedInstance(),
      );
      const i18n = await createBackgroundI18n();
      const exposureNotificationService = new ExposureNotificationService(
        backendService,
        i18n,
        DefaultFutureStorageService.sharedInstance(),
        ExposureNotification,
        FilteredMetricsService.sharedInstance(),
      );
      registerPeriodicTask(async () => {
        await FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ActiveUser});
        await exposureNotificationService.updateExposureStatusInBackground();
      }, exposureNotificationService);
    } catch (error) {
      log.error({
        category: 'background',
        message: 'runAndroidHeadlessPeriodicTask',
        error,
      });
    }
  });
  log.debug({
    category: 'background',
    message: 'registerAndroidHeadlessPeriodicTask',
  });
};

const registerAndroidHeadlessExposureCheckPeriodicTask = (task: PeriodicTask) => {
  publishDebugMetric(4.2);
  if (Platform.OS !== 'android') return;

  AppRegistry.registerHeadlessTask('EXPOSURE_CHECK_HEADLESS_TASK', () => async () => {
    log.debug({
      category: 'background',
      message: 'EXPOSURE_CHECK_HEADLESS_TASK',
    });
    try {
      await task();
    } catch (error) {
      log.error({
        category: 'background',
        message: 'runAndroidHeadlessExposureCheckPeriodicTask',
        error,
      });
    } finally {
      BackgroundFetch.finish('EXPOSURE_CHECK_HEADLESS_TASK');
    }
  });
  log.debug({
    category: 'background',
    message: 'registerAndroidHeadlessExposureCheckPeriodicTask',
  });
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
  registerAndroidHeadlessExposureCheckPeriodicTask,
};
