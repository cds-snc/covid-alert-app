import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Box, Text, LastCheckedDisplay, Icon} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const NetworkDisabledView = () => {
  const [i18n] = useI18n();
  return (
    <BaseHomeView>
      <Box marginBottom="l">
        <Icon name="icon-offline" size={44} />
      </Box>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoConnectivity')}
      </Text>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.NoConnectivityDetailed')}
      </Text>
      <LastCheckedDisplay />
      <Box marginTop="l" marginBottom="l" />
    </BaseHomeView>
  );
};
