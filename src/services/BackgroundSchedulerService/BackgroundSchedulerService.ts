import BackgroundFetch from 'react-native-background-fetch';
import {AppRegistry, Platform} from 'react-native';
import {TEST_MODE} from 'env';
import {captureException, captureMessage} from 'shared/log';

import ExposureCheckScheduler from '../../bridge/ExposureCheckScheduler';
import {PeriodicWorkPayload} from '../../bridge/PushNotification';
import {log} from '../../shared/logging/config';
import {ExposureNotificationService} from "../ExposureNotificationService";
import {getCurrentDate, minutesBetween} from "../../shared/date-fns";

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

export const PERIODIC_TASK_INTERVAL_IN_MINUTES = TEST_MODE ? 15 : 240;
export const PERIODIC_TASK_DELAY_IN_MINUTES = TEST_MODE ? 1 : PERIODIC_TASK_INTERVAL_IN_MINUTES + 5;

const registerPeriodicTask = async (task: PeriodicTask, exposureNotificationService?: ExposureNotificationService) => {
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
        captureMessage('runPeriodicTask', {taskId});
        try {
          await task();
        } catch (error) {
          captureException('runPeriodicTask', error);
        }
        BackgroundFetch.finish(taskId);
      },
    );
    const result = await BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true}).catch(
      () => false,
    );
    captureMessage('registerPeriodicTask', {result});
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

const registerAndroidHeadlessPeriodicTask = (task: PeriodicTask) => {
  if (Platform.OS !== 'android') {
    return;
  }
  BackgroundFetch.registerHeadlessTask(async ({taskId}) => {
    captureMessage('runAndroidHeadlessPeriodicTask', {taskId});
    try {
      await task();
    } catch (error) {
      captureException('runAndroidHeadlessPeriodicTask', error);
    }
    BackgroundFetch.finish(taskId);
  });
  captureMessage('registerAndroidHeadlessPeriodicTask');
};

const registerAndroidHeadlessExposureCheckPeriodicTask = (task: PeriodicTask) => {
  if (Platform.OS !== 'android') return;

  AppRegistry.registerHeadlessTask('EXPOSURE_CHECK_HEADLESS_TASK', () => async () => {
    captureMessage('EXPOSURE_CHECK_HEADLESS_TASK');
    try {
      await task();
    } catch (error) {
      captureException('runAndroidHeadlessExposureCheckPeriodicTask', error);
    } finally {
      BackgroundFetch.finish('EXPOSURE_CHECK_HEADLESS_TASK');
    }
  });
  captureMessage('registerAndroidHeadlessExposureCheckPeriodicTask');
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
  registerAndroidHeadlessExposureCheckPeriodicTask,
};
