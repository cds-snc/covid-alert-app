import {I18n} from '@shopify/react-i18n';
import {InfoButton} from 'components';
import React from 'react';

export const NotificationStatusOff = ({action, i18n}: {action: () => void; i18n: I18n}) => {
  return (
    <InfoButton
      title={i18n.translate('OverlayOpen.NotificationCardStatus')}
      color="mainBackground"
      internalLink
      text={i18n.translate('OverlayOpen.NotificationCardBody')}
      onPress={action}
      variant="bigFlatNeutralGrey"
    />
  );
};
