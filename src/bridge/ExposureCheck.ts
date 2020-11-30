import {NativeModules} from 'react-native';

import {NotificationPayload} from './PushNotification';

const ExposureCheckBridgeBare = NativeModules.ExposureCheck as {
  scheduleExposureCheck(payload: NotificationPayload): Promise<any>;
};

export const scheduleExposureCheck = ExposureCheckBridgeBare.scheduleExposureCheck;
