import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {TEST_MODE} from 'env';
import {captureException, captureMessage} from 'shared/log';

import {scheduleExposureCheck} from '../../bridge/ExposureCheck';
import {NotificationPayload} from "../../bridge/PushNotification";

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

// See https://github.com/cds-snc/covid-shield-mobile/issues/642#issuecomment-657783192
export const DEFERRED_JOB_INTERNVAL_IN_MINUTES = 240;
const EXACT_JOB_INTERNVAL_IN_MINUTES = 90;

const registerPeriodicTask = async (task: PeriodicTask) => {
  if (Platform.OS === 'ios') {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: TEST_MODE ? EXACT_JOB_INTERNVAL_IN_MINUTES : DEFERRED_JOB_INTERNVAL_IN_MINUTES,
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
    const payload: NotificationPayload = {
      alertTitle: 'Notification.ReminderTitle',
      alertBody: 'Notification.ReminderBody',
      initialDelay: DEFERRED_JOB_INTERNVAL_IN_MINUTES,
      repeatInterval: DEFERRED_JOB_INTERNVAL_IN_MINUTES,
      disableSound: true,
    };
    await scheduleExposureCheck(payload);
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

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
};
