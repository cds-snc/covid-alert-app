import React from 'react';
import {useI18n} from 'locale';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {InfoBlock} from 'components';
import {useExposureStatus, ExposureStatusType} from 'services/ExposureNotificationService';
import {getUploadDaysLeft} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';

export const ShareDiagnosisCode = () => {
  const i18n = useI18n();
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
