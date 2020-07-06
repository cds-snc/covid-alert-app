import React, {useCallback} from 'react';
import Animated, {sub, abs} from 'react-native-reanimated';
import {Box, InfoBlock, BoxProps, InfoButton, BottomSheetBehavior, Icon} from 'components';
import {useI18n, I18n} from '@shopify/react-i18n';
import {Linking, Platform, View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  SystemStatus,
  useExposureStatus,
  useStartExposureNotificationService,
} from 'services/ExposureNotificationService';
import {useNavigation} from '@react-navigation/native';
import {daysBetween} from 'shared/date-fns';

import {InfoShareView} from './InfoShareView';
import {StatusHeaderView} from './StatusHeaderView';

const SystemStatusOff = ({i18n}: {i18n: I18n}) => {
  const startExposureNotificationService = useStartExposureNotificationService();
  const onPress = () => {
    if (Platform.OS === 'android') {
      startExposureNotificationService();
      return;
    }
    return toSettings();
  };
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return (
    <InfoButton
      title={i18n.translate('OverlayOpen.ExposureNotificationCardAction')}
      text={i18n.translate('OverlayOpen.ExposureNotificationCardBody')}
      color="danger25Background"
      variant="danger50Flat"
      internalLink
      onPress={onPress}
    />
  );
};

const BluetoothStatusOff = ({i18n}: {i18n: I18n}) => {
  return (
    <InfoBlock
      titleBolded={i18n.translate('OverlayOpen.BluetoothCardAction')}
      backgroundColor="danger25Background"
      color="bodyText"
      button={{
        text: '',
        action: () => {},
      }}
      text={i18n.translate('OverlayOpen.BluetoothCardBody')}
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
    const daysLeft = daysBetween(new Date(), new Date(exposureStatus.cycleEndsAt));
    const bodyText =
      i18n.translate('OverlayOpen.EnterCodeCardBodyDiagnosed') +
      i18n.translate('OverlayOpen.EnterCodeCardDiagnosedCountdown', {number: daysLeft});
    return (
      <InfoBlock
        titleBolded={i18n.translate('OverlayOpen.EnterCodeCardTitleDiagnosed')}
        text={bodyText}
        button={{
          text: '',
          action: () => {},
        }}
        backgroundColor="infoBlockNeutralBackground"
        color="bodyText"
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
      color="bodyText"
      showButton
    />
  );
};

interface Props extends Pick<BoxProps, 'maxWidth'> {
  status: SystemStatus;
  notificationWarning: boolean;
  turnNotificationsOn: () => void;
  bottomSheetBehavior: BottomSheetBehavior;
}

export const OverlayView = ({
  status,
  notificationWarning,
  turnNotificationsOn,
  maxWidth,
  bottomSheetBehavior,
}: Props) => {
  const [i18n] = useI18n();

  return (
    <Animated.View style={{opacity: abs(sub(bottomSheetBehavior.callbackNode, 1))}}>
      <View style={styles.content}>
        <Box maxWidth={maxWidth}>
          <Box marginBottom="s">
            <StatusHeaderView enabled={status === SystemStatus.Active} />
          </Box>
          <View style={styles.collapseContentHandleBar}>
            <TouchableOpacity
              onPress={bottomSheetBehavior.collapse}
              style={styles.collapseButton}
              accessibilityLabel={i18n.translate('BottomSheet.Collapse')}
              accessibilityRole="button"
            >
              <Icon name="sheet-handle-bar-close" size={36} />
            </TouchableOpacity>
          </View>
          <Box marginBottom="m" marginTop="s" marginHorizontal="m">
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
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
  },
  collapseContentHandleBar: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: -32,
  },
  collapseButton: {
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
