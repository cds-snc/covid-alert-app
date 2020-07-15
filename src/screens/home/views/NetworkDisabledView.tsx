import React from 'react';
import {useI18n} from 'locale';
import {Box, Text} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const NetworkDisabledView = () => {
  const i18n = useI18n();
  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoConnectivity')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoConnectivityDetailed')}
      </Text>
      <Box marginBottom="xxl" />
    </BaseHomeView>
  );
};
