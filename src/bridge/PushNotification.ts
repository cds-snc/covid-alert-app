import {NativeModules, Platform} from 'react-native';
import RNPushNotification, {PushNotificationPermissions} from '@react-native-community/push-notification-ios';

interface NotificationPayload {
  alertTitle: string;
  alertBody: string;
}

interface PushNotificationInterface {
  requestPermissions(permissions?: PushNotificationPermissions): Promise<PushNotificationPermissions>;
  presentLocalNotification(payload: NotificationPayload): void;
}

const PushNotificationIOS: PushNotificationInterface = {
  requestPermissions: RNPushNotification.requestPermissions,
  presentLocalNotification: payload => {
    RNPushNotification.removeAllDeliveredNotifications();
    RNPushNotification.presentLocalNotification(payload);
  },
};

const NativePushNotification: PushNotificationInterface =
  Platform.OS === 'ios' ? PushNotificationIOS : NativeModules.PushNotification;

export default NativePushNotification;
