import React, {useCallback} from 'react';
import {I18n} from '@shopify/react-i18n';
import {InfoBlock} from 'components';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

export const TurnAppBackOn = ({i18n}: {i18n: I18n}) => {
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
