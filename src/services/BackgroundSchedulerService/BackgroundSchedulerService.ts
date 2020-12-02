import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {TEST_MODE} from 'env';
import {captureException, captureMessage} from 'shared/log';

import {scheduleExposureCheck} from '../../bridge/ExposureCheck';
import {PeriodicWorkPayload} from '../../bridge/PushNotification';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

// See https://github.com/cds-snc/covid-shield-mobile/issues/642#issuecomment-657783192
export const PERIODIC_TASK_INTERVAL_IN_MINUTES = TEST_MODE ? 15 : 240;
export const PERIODIC_TASK_DELAY_IN_MINUTES = TEST_MODE ? 2 : PERIODIC_TASK_INTERVAL_IN_MINUTES + 5;

const registerPeriodicTask = async (task: PeriodicTask) => {
  if (Platform.OS === 'ios') {
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
    const payload: PeriodicWorkPayload = {
      initialDelay: PERIODIC_TASK_DELAY_IN_MINUTES,
      repeatInterval: PERIODIC_TASK_INTERVAL_IN_MINUTES,
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
