import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {MINIMUM_FETCH_INTERVAL} from 'env';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

const registerPeriodicTask = async (task: PeriodicTask) => {
  console.log('registerPeriodicTask');
  BackgroundFetch.configure(
    {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async taskId => {
      console.log("registerPeriodicTask - callback taskId", taskId)
      BackgroundFetch.status((status) => {
        console.log("BackgroundFetch.status", status)
      });
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
  const result = await BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true});
  console.log("registerPeriodicTask - scheduleTask promise", result)
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
