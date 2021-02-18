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
import {getUploadDaysLeft} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {ScrollView} from 'react-native-gesture-handler';
import {useAccessibilityService} from 'services/AccessibilityService';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {QR_ENABLED} from 'env';

import {StatusHeaderView} from '../home/views/StatusHeaderView';

import {InfoShareView} from './InfoShareView';
import {PrimaryActionButton} from './PrimaryActionButton';

const QRCode = ({i18n}: {i18n: I18n}) => {
  const navigation = useNavigation();
  return (
    <PrimaryActionButton
      icon="qr-code"
      text={i18n.translate('QRCode.CTA')}
      onPress={() => {
        navigation.navigate('QRCodeFlow');
      }}
    />
  );
};

const SystemStatusOff = ({i18n}: {i18n: I18n}) => {
  const startExposureNotificationService = useStartExposureNotificationService();
  const onPress = async () => {
    if (Platform.OS === 'android') {
      await startExposureNotificationService();
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
  const onPress = async () => {
    if (Platform.OS === 'android') {
      await startExposureNotificationService();
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
};

const ShareDiagnosisCode = ({i18n}: {i18n: I18n}) => {
  const navigation = useNavigation();
  const exposureStatus = useExposureStatus();

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
    const daysLeft = getUploadDaysLeft(exposureStatus.cycleEndsAt);
    let bodyText = i18n.translate('OverlayOpen.EnterCodeCardBodyDiagnosed');
    if (daysLeft > 0) {
      bodyText += i18n.translate(pluralizeKey('OverlayOpen.EnterCodeCardDiagnosedCountdown', daysLeft), {
        number: daysLeft,
      });
    }

    return exposureStatus.hasShared ? (
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
    ) : (
      <InfoBlock
        titleBolded={i18n.translate('OverlayOpen.CodeNotShared.Title')}
        text={i18n.translate('OverlayOpen.CodeNotShared.Body')}
        button={{
          text: i18n.translate('OverlayOpen.CodeNotShared.CTA'),
          action: () => {
            navigation.navigate('DataSharing', {screen: 'IntermediateScreen'});
          },
        }}
        backgroundColor="danger25Background"
        color="bodyText"
        showButton
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

const TurnAppBackOn = ({i18n}: {i18n: I18n}) => {
  const startExposureNotificationService = useStartExposureNotificationService();

  const onStart = useCallback(async () => {
    await startExposureNotificationService();
  }, [startExposureNotificationService]);

  return (
    <InfoBlock
      titleBolded={i18n.translate('OverlayOpen.TurnAppBackOn.Title')}
      text={i18n.translate('OverlayOpen.TurnAppBackOn.Body')}
      button={{
        text: i18n.translate('OverlayOpen.TurnAppBackOn.CTA'),
        action: () => {
          onStart();
        },
      }}
      backgroundColor="danger25Background"
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
}

export const OverlayView = ({status, notificationWarning, turnNotificationsOn}: Props) => {
  const i18n = useI18n();
  const {userStopped} = useStorage();
  const navigation = useNavigation();
  const close = useCallback(() => {
    navigation.navigate('home');
  }, [navigation]);
  return (
    <AccessibleView>
      <SafeAreaView>
        <Box>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={close}
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

          {userStopped && status !== SystemStatus.Active && (
            <Box marginBottom="m" marginTop="xl" marginHorizontal="m">
              <TurnAppBackOn i18n={i18n} />
            </Box>
          )}

          <Box marginBottom="m" marginTop={userStopped ? 's' : 'xl'} marginHorizontal="m">
            <ShareDiagnosisCode i18n={i18n} />
          </Box>

          {!userStopped && (status === SystemStatus.Disabled || status === SystemStatus.Restricted) && (
            <Box marginBottom="m" marginHorizontal="m">
              <SystemStatusOff i18n={i18n} />
            </Box>
          )}
          {!userStopped && status === SystemStatus.Unauthorized && (
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

          {QR_ENABLED && (
            <Box marginBottom="m" marginHorizontal="m">
              <QRCode i18n={i18n} />
            </Box>
          )}

          <Box marginBottom="m" marginHorizontal="m">
            <InfoShareView />
          </Box>
        </Box>
      </SafeAreaView>
    </AccessibleView>
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
