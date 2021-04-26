import React from 'react';
import {useI18n} from 'locale';
import {InfoBlock} from 'components';

export const OfflineWarning = () => {
  const i18n = useI18n();
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
};
