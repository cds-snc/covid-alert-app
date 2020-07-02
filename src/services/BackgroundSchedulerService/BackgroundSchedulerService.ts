import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {MINIMUM_FETCH_INTERVAL} from 'env';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

const registerPeriodicTask = (task: PeriodicTask) => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async taskId => {
      if (taskId === BACKGROUND_TASK_ID) {
        try {
          await task();
        } catch {
          // noop
        }
      }
      BackgroundFetch.finish(taskId);
    },
  );
  BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true});
};

const registerAndroidHeadlessPeriodicTask = (task: PeriodicTask) => {
  if (Platform.OS !== 'android') {
    return;
  }
  BackgroundFetch.registerHeadlessTask(async ({taskId}) => {
    try {
      await task();
    } catch {
      // noop
    }
    BackgroundFetch.finish(taskId);
  });
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
};
