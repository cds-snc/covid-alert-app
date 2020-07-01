import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';

const BACKGROUND_TASK_ID = 'com.covidsheild.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

const registerPeriodicTask = (task: PeriodicTask) => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async taskId => {
      if (taskId === BACKGROUND_TASK_ID) {
        await task();
        BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true});
        BackgroundFetch.finish(taskId);
      }
    },
  );
  BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true});
};

const registerAndroidHeadlessPeriodicTask = (task: PeriodicTask) => {
  if (Platform.OS !== 'android') {
    return;
  }
  BackgroundFetch.registerHeadlessTask(async ({taskId}) => {
    await task();
    BackgroundFetch.finish(taskId);
  });
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
};
