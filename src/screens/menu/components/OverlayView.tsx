import React, {useCallback} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {Box, ButtonWrapper, InfoBlock, BoxProps, InfoButton, Icon} from 'components';
import {useI18n, I18n} from 'locale';
import {Linking, Platform} from 'react-native';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';

import {StatusHeaderView} from '../../home/views/StatusHeaderView';

import {InfoShareView} from './InfoShareView';
import {PrimaryActionButton} from './PrimaryActionButton';
import {TurnAppBackOn} from '../views/TurnAppBackOn';
import {NotificationStatusOff} from '../views/NotificationStatusOff';
import {BluetoothStatusOff} from '../views/BluetoothStatusOff';
import {SystemStatusOff} from '../views/SystemStatusOff';
import {SystemStatusUnauthorized} from '../views/SystemStatusUnauthorized';

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

interface Props extends Pick<BoxProps, 'maxWidth'> {
  status: SystemStatus;
  notificationWarning: boolean;
  turnNotificationsOn: () => void;
}

export const OverlayView = ({status, notificationWarning, turnNotificationsOn}: Props) => {
  const i18n = useI18n();
  const {userStopped, qrEnabled} = useStorage();
  const navigation = useNavigation();
  const close = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);
  return (
    <SafeAreaView>
      <ScrollView>
        <Box backgroundColor="overlayBackground">
          <Box flexDirection="row" marginTop="m" marginHorizontal="m">
            <Box marginVertical="m" flex={1}>
              <StatusHeaderView enabled={status === SystemStatus.Active} />
            </Box>
            <ButtonWrapper onPress={close} color="infoBlockNeutralBackground">
              <Box padding="s">
                <Icon name="close" size={20} />
              </Box>
            </ButtonWrapper>
          </Box>
          {userStopped && status !== SystemStatus.Active && (
            <Box marginBottom="m" marginTop="l" marginHorizontal="m">
              <TurnAppBackOn i18n={i18n} />
            </Box>
          )}

          <Box marginBottom="m" marginTop="s" marginHorizontal="m">
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

          {qrEnabled && (
            <Box marginBottom="m" marginHorizontal="m">
              <QRCode i18n={i18n} />
            </Box>
          )}

          <Box marginBottom="m" marginHorizontal="m">
            <InfoShareView />
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};
