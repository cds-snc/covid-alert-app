import {NativeModules, Platform} from 'react-native';
import RNPushNotification, {PushNotificationPermissions} from '@react-native-community/push-notification-ios';

export interface PeriodicWorkPayload {
  repeatInterval?: number;
  flexInterval?: number;
  initialDelay?: number;
}

export interface NotificationPayload {
  alertTitle: string;
  alertBody: string;
  channelName?: string;
  disableSound?: boolean;
}

interface PushNotificationInterface {
  requestPermissions(permissions?: PushNotificationPermissions): Promise<PushNotificationPermissions>;
  presentLocalNotification(payload: NotificationPayload): void;
  removeAllPendingNotificationRequests(): void;
}

const PushNotificationIOS: PushNotificationInterface = {
  requestPermissions: RNPushNotification.requestPermissions,
  presentLocalNotification: payload => {
    RNPushNotification.removeAllDeliveredNotifications();
    RNPushNotification.addNotificationRequest({
      id: 'exposureNotification',
      title: payload.alertTitle,
      body: payload.alertBody,
    });
  },
  removeAllPendingNotificationRequests: () => {
    RNPushNotification.removeAllPendingNotificationRequests();
  },
};

const NativePushNotification: PushNotificationInterface =
  Platform.OS === 'ios' ? PushNotificationIOS : NativeModules.PushNotification;

export default NativePushNotification;
