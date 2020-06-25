import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Text, Box, Icon} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const BluetoothDisabledView = () => {
  const [i18n] = useI18n();

  return (
    <BaseHomeView>
      <Box marginBottom="l" marginLeft="-xxl">
        <Icon name="icon-bluetooth-disabled" size={152} />
      </Box>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.BluetoothDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.EnableBluetoothCTA')}
      </Text>
    </BaseHomeView>
  );
};
