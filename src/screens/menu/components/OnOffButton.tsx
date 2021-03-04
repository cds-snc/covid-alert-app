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
import {useStorage} from 'services/StorageService';
import {Box} from 'components';

import {PrimaryActionButton} from './PrimaryActionButton';

export const OnOffButton = () => {
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
  }, [i18n, stopExposureNotificationService]);

  const onStart = useCallback(async () => {
    await startExposureNotificationService();
  }, [startExposureNotificationService]);

  const [systemStatus] = useSystemStatus();

  if (systemStatus === SystemStatus.Active) {
    return (
      <Box marginBottom="s">
        <PrimaryActionButton
          onPress={onStop}
          text={i18n.translate('Info.ToggleCovidAlert.TurnOff')}
          iconBackgroundColor="danger25Background"
          icon="icon-exclamation"
          showChevron={false}
        />
      </Box>
    );
  }
  if (!userStopped) {
    return null;
  }
  return (
    <Box marginBottom="s">
      <PrimaryActionButton
        onPress={onStart}
        text={i18n.translate('Info.ToggleCovidAlert.TurnOn')}
        iconBackgroundColor="danger25Background"
        icon="icon-exclamation"
        showChevron={false}
      />
    </Box>
  );
};
