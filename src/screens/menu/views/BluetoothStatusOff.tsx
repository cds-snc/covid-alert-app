import React from 'react';
import {useI18n} from 'locale';
import {InfoBlock} from 'components';

export const BluetoothStatusOff = () => {
  const i18n = useI18n();
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
