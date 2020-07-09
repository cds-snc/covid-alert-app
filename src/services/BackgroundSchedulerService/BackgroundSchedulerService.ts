import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {MINIMUM_FETCH_INTERVAL} from 'env';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

const registerPeriodicTask = (task: PeriodicTask) => {
  console.log('registerPeriodicTask');
  BackgroundFetch.configure(
    {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async taskId => {
      if (taskId === BACKGROUND_TASK_ID) {
        console.log(`registerPeriodicTask - ${taskId}`);
        try {
          await task();
        } catch (e) {
          console.error('registerPeriodicTask', e.message);
          // noop
        }
      }
      BackgroundFetch.finish(taskId);
    },
  );
  BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true});
};

const registerAndroidHeadlessPeriodicTask = (task: PeriodicTask) => {
  console.log('registerAndroidHeadlessPeriodicTask');
  if (Platform.OS !== 'android') {
    return;
  }
  BackgroundFetch.registerHeadlessTask(async ({taskId}) => {
    try {
      console.log(`registerHeadlessTask - ${taskId}`);
      await task();
    } catch (e) {
      console.error('registerAndroidHeadlessPeriodicTask', e.message);
      // noop
    }
    BackgroundFetch.finish(taskId);
  });
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
};
