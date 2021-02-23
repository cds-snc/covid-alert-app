import React from 'react';
import {useI18n} from 'locale';
import {InfoButton} from 'components';

export const NotificationStatusOff = ({action}: {action: () => void}) => {
  const i18n = useI18n();
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
