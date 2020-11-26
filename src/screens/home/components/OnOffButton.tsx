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

import {InfoShareItem} from './InfoShareItem';

const TurnOnButton = ({systemStatus, onStart, CTA}: {systemStatus: SystemStatus; onStart: () => void; CTA: string}) => {
  if (systemStatus !== SystemStatus.Undefined && systemStatus !== SystemStatus.Unauthorized) {
    return <InfoShareItem onPress={onStart} text={CTA} icon="icon-chevron" lastItem />;
  }
  return null;
};

export const OnOffButton = ({bottomSheetBehavior}: {bottomSheetBehavior: BottomSheetBehavior}) => {
  const i18n = useI18n();
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
            bottomSheetBehavior.collapse();
            NativePushNotification.presentLocalNotification({
              alertTitle: i18n.translate('Notification.PausedMessageTitle'),
              alertBody: i18n.translate('Notification.PausedMessageBody'),
            });
          },
          style: 'default',
        },
      ],
    );
  }, [bottomSheetBehavior, i18n, stopExposureNotificationService]);

  const onStart = useCallback(async () => {
    await startExposureNotificationService();
  }, [startExposureNotificationService]);

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
  return (
    <TurnOnButton systemStatus={systemStatus} onStart={onStart} CTA={i18n.translate('Info.ToggleCovidAlert.TurnOn')} />
  );
};
