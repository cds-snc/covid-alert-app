import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {MINIMUM_FETCH_INTERVAL} from 'env';
import * as Sentry from '@sentry/react-native';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

const registerPeriodicTask = async (task: PeriodicTask) => {
  Sentry.captureMessage('registerPeriodicTask');
  BackgroundFetch.configure(
    {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async taskId => {
      Sentry.captureMessage(`registerPeriodicTask - callback taskId ${taskId}`);
      BackgroundFetch.status(status => {
        Sentry.captureMessage(`BackgroundFetch.status ${status}`);
      });
      if (taskId === BACKGROUND_TASK_ID) {
        Sentry.captureMessage(`registerPeriodicTask - ${taskId}`);
        try {
          await task();
        } catch (error) {
          Sentry.captureException('registerPeriodicTask', error.message);
          // noop
        }
      }
      BackgroundFetch.finish(taskId);
    },
  );
  const result = await BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true});
  Sentry.captureMessage(`registerPeriodicTask - scheduleTask promise ${result}`);
};

const registerAndroidHeadlessPeriodicTask = (task: PeriodicTask) => {
  Sentry.captureMessage('registerAndroidHeadlessPeriodicTask');
  if (Platform.OS !== 'android') {
    return;
  }
  BackgroundFetch.registerHeadlessTask(async ({taskId}) => {
    try {
      Sentry.captureMessage(`registerHeadlessTask - ${taskId}`);
      await task();
    } catch (error) {
      Sentry.captureException('registerAndroidHeadlessPeriodicTask', error.message);
      // noop
    }
    BackgroundFetch.finish(taskId);
  });
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
};
