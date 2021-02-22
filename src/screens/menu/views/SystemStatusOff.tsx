import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {InfoButton} from 'components';
import {Platform, Linking} from 'react-native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

export const SystemStatusOff = () => {
  const i18n = useI18n();
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
