import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Platform, Linking} from 'react-native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';
import {InfoButton} from 'components';

export const SystemStatusUnauthorized = () => {
  const i18n = useI18n();
  const startExposureNotificationService = useStartExposureNotificationService();
  const onPress = async () => {
    if (Platform.OS === 'android') {
      await startExposureNotificationService(false);
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
