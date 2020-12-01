import {NativeModules} from 'react-native';

import {NotificationPayload, PeriodicWorkPayload} from './PushNotification';

const ExposureCheckBridgeBare = NativeModules.ExposureCheck as {
  scheduleExposureCheck(payload: PeriodicWorkPayload): Promise<any>;
  executeExposureCheck(payload: NotificationPayload): Promise<any>;
};

export const scheduleExposureCheck = ExposureCheckBridgeBare.scheduleExposureCheck;
export const executeExposureCheck = ExposureCheckBridgeBare.executeExposureCheck;
