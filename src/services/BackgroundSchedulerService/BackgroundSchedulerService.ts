import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {MINIMUM_FETCH_INTERVAL} from 'env';
import {captureMessage, captureException} from 'shared/log';

const BACKGROUND_TASK_ID = 'app.covidshield.exposure-notification';

interface PeriodicTask {
  (): Promise<void>;
}

const registerPeriodicTask = async (task: PeriodicTask) => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
    },
    async taskId => {
      captureMessage('runPeriodicTask', {taskId});
      if (taskId === BACKGROUND_TASK_ID) {
        try {
          await task();
        } catch (error) {
          captureException(error, {message: 'registerPeriodicTask'});
          // noop
        }
      }
      BackgroundFetch.finish(taskId);
    },
  );
  const result = await BackgroundFetch.scheduleTask({taskId: BACKGROUND_TASK_ID, delay: 0, periodic: true}).catch(
    () => false,
  );
  captureMessage('registerPeriodicTask', {result});
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
      captureException(error, {message: 'registerAndroidHeadlessPeriodicTask'});
      // noop
    }
    BackgroundFetch.finish(taskId);
  });
  captureMessage('registerAndroidHeadlessPeriodicTask');
};

export const BackgroundScheduler = {
  registerPeriodicTask,
  registerAndroidHeadlessPeriodicTask,
};
