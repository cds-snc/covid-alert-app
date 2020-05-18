import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';

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
      await task();
      BackgroundFetch.finish(taskId);
    },
  );
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
