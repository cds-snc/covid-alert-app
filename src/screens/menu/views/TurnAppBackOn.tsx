import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {InfoBlock} from 'components';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

export const TurnAppBackOn = () => {
  const i18n = useI18n();
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
