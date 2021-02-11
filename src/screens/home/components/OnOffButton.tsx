import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import {
  SystemStatus,
  useStopExposureNotificationService,
  useStartExposureNotificationService,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import NativePushNotification from 'bridge/PushNotification';
import {useI18n} from 'locale';
import {BottomSheetBehavior} from 'components';
import {useStorage} from 'services/StorageService';

import {InfoShareItem} from './InfoShareItem';

export const OnOffButton = ({bottomSheetBehavior}: {bottomSheetBehavior: BottomSheetBehavior}) => {
  const i18n = useI18n();
  const {userStopped} = useStorage();
  const startExposureNotificationService = useStartExposureNotificationService();
  const stopExposureNotificationService = useStopExposureNotificationService();

  const onStop = useCallback(() => {
    Alert.alert(
      i18n.translate('Info.ToggleCovidAlert.Confirm.Title'),
      i18n.translate('Info.ToggleCovidAlert.Confirm.Body'),
      [
        {
          text: i18n.translate('Info.ToggleCovidAlert.Confirm.Cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: i18n.translate('Info.ToggleCovidAlert.Confirm.Accept'),
          onPress: async () => {
            bottomSheetBehavior.collapse();
            await stopExposureNotificationService();
            NativePushNotification.presentLocalNotification({
              alertTitle: i18n.translate('Notification.PausedMessageTitle'),
              alertBody: i18n.translate('Notification.PausedMessageBody'),
              channelName: i18n.translate('Notification.AndroidChannelName'),
            });
          },
          style: 'default',
        },
      ],
    );
  }, [bottomSheetBehavior, i18n, stopExposureNotificationService]);

  const onStart = useCallback(async () => {
    bottomSheetBehavior.collapse();
    await startExposureNotificationService();
  }, [bottomSheetBehavior, startExposureNotificationService]);

  const [systemStatus] = useSystemStatus();

  if (systemStatus === SystemStatus.Active) {
    return (
      <InfoShareItem
        onPress={onStop}
        text={i18n.translate('Info.ToggleCovidAlert.TurnOff')}
        icon="icon-chevron"
        lastItem
      />
    );
  }
  if (!userStopped) {
    return null;
  }
  return (
    <InfoShareItem
      onPress={onStart}
      text={i18n.translate('Info.ToggleCovidAlert.TurnOn')}
      icon="icon-chevron"
      lastItem
    />
  );
};
