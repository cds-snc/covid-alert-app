import React from 'react';
import {I18n} from '@shopify/react-i18n';
import {InfoBlock} from 'components';

export const BluetoothStatusOff = ({i18n}: {i18n: I18n}) => {
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
