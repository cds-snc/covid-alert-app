import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {useExposureStatus, ExposureStatusType} from 'services/ExposureNotificationService';

import {PrimaryActionButton} from '../components/PrimaryActionButton';

export const ShareDiagnosisCode = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const exposureStatus = useExposureStatus();
  const network = useNetInfo();

  const navFinishSharing = useCallback(() => {
    navigation.navigate('DataSharing', {screen: 'IntermediateScreen'});
  }, [navigation]);
  const navDataSharing = useCallback(() => {
    navigation.navigate('DataSharing');
  }, [navigation]);

  if (!network.isConnected && exposureStatus.type !== ExposureStatusType.Diagnosed) {
    return null;
  }
  if (exposureStatus.type === ExposureStatusType.Diagnosed && exposureStatus.hasShared) {
    return null;
  }

  // if (exposureStatus.type === ExposureStatusType.Diagnosed) {
  return (
    <PrimaryActionButton
      icon="icon-three-dots"
      iconBackgroundColor="otkButton"
      text={i18n.translate('OverlayOpen.ShareDiagnosisCode.CtaFinish')}
      onPress={navFinishSharing}
    />
  );
  // }
  // return (
  //   <PrimaryActionButton
  //     icon="otk-entry"
  //     text={i18n.translate('OverlayOpen.ShareDiagnosisCode.CtaReport')}
  //     onPress={navDataSharing}
  //   />
  // );
};
