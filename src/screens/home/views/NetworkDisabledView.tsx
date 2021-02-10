import React from 'react';
import {useI18n} from 'locale';
import {Text} from 'components';

import {SystemStatusWrapper} from '../components/BaseHomeView';

export const NetworkDisabledView = () => {
  const i18n = useI18n();
  return (
    <SystemStatusWrapper iconName="icon-bluetooth-disabled">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoConnectivity')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoConnectivityDetailed')}
      </Text>
    </SystemStatusWrapper>
  );
};
