import React, {useCallback} from 'react';
import Animated, {sub, abs} from 'react-native-reanimated';
import {useNetInfo} from '@react-native-community/netinfo';
import {Box, InfoBlock, BoxProps, InfoButton, BottomSheetBehavior, Icon} from 'components';
import {useI18n, I18n} from 'locale';
import {Linking, Platform, TouchableOpacity, StyleSheet, View} from 'react-native';
import {
  ExposureStatusType,
  SystemStatus,
  useExposureStatus,
  useStartExposureNotificationService,
} from 'services/ExposureNotificationService';
import {useNavigation} from '@react-navigation/native';
import {daysBetween, getCurrentDate} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {ScrollView} from 'react-native-gesture-handler';
import {useAccessibilityService} from 'services/AccessibilityService';
import {SafeAreaView} from 'react-native-safe-area-context';

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

const SystemStatusUnauthorized = ({i18n}: {i18n: I18n}) => {
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
      title={i18n.translate('OverlayOpen.EnUnauthorizedCardAction')}
      text={i18n.translate('OverlayOpen.EnUnauthorizedCardBody')}
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

const ShareDiagnosisCode = ({i18n, isBottomSheetExpanded}: {i18n: I18n; isBottomSheetExpanded: boolean}) => {
  const navigation = useNavigation();
  const [exposureStatus] = useExposureStatus();

  //

  const network = useNetInfo();

  if (!network.isConnected && exposureStatus.type !== ExposureStatusType.Diagnosed) {
    return (
      <InfoBlock
        titleBolded={i18n.translate('OverlayOpen.NoConnectivityCardAction')}
        backgroundColor="danger25Background"
        color="bodyText"
        button={{
          text: '',
          action: () => {},
        }}
        text={i18n.translate('OverlayOpen.NoConnectivityCardBody')}
        showButton={false}
      />
    );
  }

  if (exposureStatus.type === ExposureStatusType.Diagnosed) {
    const daysLeft = daysBetween(getCurrentDate(), new Date(exposureStatus.cycleEndsAt)) - 1;
    let bodyText = i18n.translate('OverlayOpen.EnterCodeCardBodyDiagnosed');
    if (daysLeft > 0) {
      bodyText += i18n.translate(pluralizeKey('OverlayOpen.EnterCodeCardDiagnosedCountdown', daysLeft), {
        number: daysLeft,
      });
    }

    return (
      <InfoBlock
        focusOnTitle={isBottomSheetExpanded}
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
      focusOnTitle={isBottomSheetExpanded}
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

const AccessibleView = ({children}: {children: React.ReactNode}) => {
  const accessibilityService = useAccessibilityService();

  return accessibilityService.isScreenReaderEnabled ? (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );
};

interface Props extends Pick<BoxProps, 'maxWidth'> {
  status: SystemStatus;
  notificationWarning: boolean;
  turnNotificationsOn: () => void;
  bottomSheetBehavior: BottomSheetBehavior;
}

export const OverlayView = ({status, notificationWarning, turnNotificationsOn, bottomSheetBehavior}: Props) => {
  const i18n = useI18n();

  return (
    <Animated.View style={{opacity: abs(sub(bottomSheetBehavior.callbackNode, 1))}}>
      <AccessibleView>
        <SafeAreaView>
          <Box>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={bottomSheetBehavior.collapse}
              style={styles.collapseButton}
              accessibilityLabel={i18n.translate('BottomSheet.Collapse')}
              accessibilityRole="button"
              testID="BottomSheet-Close"
            >
              <Icon name="sheet-handle-bar-close" size={36} />
            </TouchableOpacity>

            <Box marginBottom="s">
              <StatusHeaderView enabled={status === SystemStatus.Active} />
            </Box>
            <Box marginBottom="m" marginTop="s" marginHorizontal="m">
              <ShareDiagnosisCode isBottomSheetExpanded={bottomSheetBehavior.isExpanded} i18n={i18n} />
            </Box>
            {(status === SystemStatus.Disabled || status === SystemStatus.Restricted) && (
              <Box marginBottom="m" marginHorizontal="m">
                <SystemStatusOff i18n={i18n} />
              </Box>
            )}
            {status === SystemStatus.Unauthorized && (
              <Box marginBottom="m" marginHorizontal="m">
                <SystemStatusUnauthorized i18n={i18n} />
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
        </SafeAreaView>
      </AccessibleView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: -26,
  },
  collapseButton: {
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: -10,
  },
});
