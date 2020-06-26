import React, {useCallback} from 'react';
import {Box, InfoBlock, BoxProps, InfoButton} from 'components';
import {useI18n, I18n} from '@shopify/react-i18n';
import {Linking} from 'react-native';
import {SystemStatus, useExposureStatus} from 'services/ExposureNotificationService';
import {useNavigation} from '@react-navigation/native';

import {InfoShareView} from './InfoShareView';
import {StatusHeaderView} from './StatusHeaderView';

const SystemStatusOff = ({i18n}: {i18n: I18n}) => {
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return (
    <InfoBlock
      icon="icon-exposure-notifications-off"
      title={i18n.translate('OverlayOpen.ExposureNotificationCardStatus')}
      titleBolded={i18n.translate('OverlayOpen.ExposureNotificationCardStatusOff')}
      text={i18n.translate('OverlayOpen.ExposureNotificationCardBody')}
      button={{text: i18n.translate('OverlayOpen.ExposureNotificationCardAction'), action: toSettings}}
      backgroundColor="errorBackground"
      color="errorText"
    />
  );
};

const BluetoothStatusOff = ({i18n}: {i18n: I18n}) => {
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  return (
    <InfoBlock
      icon="icon-bluetooth-off"
      title={i18n.translate('OverlayOpen.BluetoothCardStatus')}
      titleBolded={i18n.translate('OverlayOpen.BluetoothCardStatusOff')}
      text={i18n.translate('OverlayOpen.BluetoothCardBody')}
      button={{text: i18n.translate('OverlayOpen.BluetoothCardAction'), action: toSettings}}
      backgroundColor="errorBackground"
      color="errorText"
      showButton={false}
    />
  );
};

const NotificationStatusOff = ({action, i18n}: {action: () => void; i18n: I18n}) => {
  return (
    <InfoButton
      title={i18n.translate('OverlayOpen.NotificationCardStatus')}
      color="mainBackground"
      internalLink
      text={i18n.translate('OverlayOpen.NotificationCardBody')}
      onPress={action}
      variant="bigFlatNeutralGrey"
    />
  );

  /*
  return (
    <InfoBlock
      icon="icon-notifications"
      title={i18n.translate('OverlayOpen.NotificationCardStatus')}
      titleBolded={i18n.translate('OverlayOpen.NotificationCardStatusOff')}
      text={i18n.translate('OverlayOpen.NotificationCardBody')}
      button={{text: i18n.translate('OverlayOpen.NotificationCardAction'), action}}
      backgroundColor="infoBlockNeutralBackground"
      color="overlayBodyText"
    />
  );
  */
};

const ShareDiagnosisCode = ({i18n}: {i18n: I18n}) => {
  const navigation = useNavigation();
  const [exposureStatus] = useExposureStatus();
  if (exposureStatus.type === 'diagnosed') {
    return (
      <InfoBlock
        titleBolded={i18n.translate('OverlayOpen.EnterCodeCardTitleDiagnosed')}
        text={i18n.translate('OverlayOpen.EnterCodeCardBodyDiagnosed')}
        button={{
          text: '',
          action: () => {},
        }}
        backgroundColor="infoBlockNeutralBackground"
        color="infoBlockBrightText"
        showButton={false}
      />
    );
  }
  return (
    <InfoBlock
      titleBolded={i18n.translate('OverlayOpen.EnterCodeCardTitle')}
      text={i18n.translate('OverlayOpen.EnterCodeCardBody')}
      button={{
        text: i18n.translate('OverlayOpen.EnterCodeCardAction'),
        action: () => navigation.navigate('DataSharing'),
      }}
      backgroundColor="infoBlockNeutralBackground"
      color="infoBlockBrightText"
      showButton
    />
  );
};

interface Props extends Pick<BoxProps, 'maxWidth'> {
  status: SystemStatus;
  notificationWarning: boolean;
  turnNotificationsOn: () => void;
}

export const OverlayView = ({status, notificationWarning, turnNotificationsOn, maxWidth}: Props) => {
  const [i18n] = useI18n();

  return (
    <Box maxWidth={maxWidth}>
      <Box marginBottom="l">
        <StatusHeaderView enabled={status === SystemStatus.Active} />
      </Box>
      <Box marginBottom="m" marginTop="xxl" marginHorizontal="m">
        <ShareDiagnosisCode i18n={i18n} />
      </Box>
      {(status === SystemStatus.Disabled || status === SystemStatus.Restricted) && (
        <Box marginBottom="m" marginHorizontal="m">
          <SystemStatusOff i18n={i18n} />
        </Box>
      )}
      {status === SystemStatus.BluetoothOff && (
        <Box marginBottom="m" marginHorizontal="m">
          <BluetoothStatusOff i18n={i18n} />
        </Box>
      )}
      {notificationWarning && (
        <Box marginBottom="m" marginHorizontal="m">
          <NotificationStatusOff action={turnNotificationsOn} i18n={i18n} />
        </Box>
      )}
      <Box marginBottom="m" marginHorizontal="m">
        <InfoShareView />
      </Box>
    </Box>
  );
};
