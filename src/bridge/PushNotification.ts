import {NativeModules, Platform} from 'react-native';
import PushNotificationIOS, {
  PushNotificationPermissions,
  PresentLocalNotificationDetails,
} from '@react-native-community/push-notification-ios';

interface PushNotificationInterface {
  requestPermissions(permissions?: PushNotificationPermissions): Promise<PushNotificationPermissions>;
  presentLocalNotification(details: PresentLocalNotificationDetails): void;
}

const NativePushNotification = (Platform.OS === 'ios'
  ? PushNotificationIOS
  : NativeModules.PushNotification) as PushNotificationInterface;

export default NativePushNotification;
