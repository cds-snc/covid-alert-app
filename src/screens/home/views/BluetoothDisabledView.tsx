import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {Box, Text, Button, Icon, LastCheckedDisplay} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const BluetoothDisabledView = () => {
  const [i18n] = useI18n();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return (
    <BaseHomeView>
      <Box marginBottom="l">
        <Icon name="icon-bluetooth-disabled" size={44} />
      </Box>
      <Text textAlign="center" variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.BluetoothDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText" textAlign="center">
        {i18n.translate('Home.EnableBluetoothCTA')}
      </Text>
      <LastCheckedDisplay />
      <Box alignSelf="stretch" marginTop="l">
        <Button text={i18n.translate('Home.TurnOnBluetooth')} variant="bigFlat" onPress={toSettings} />
      </Box>
    </BaseHomeView>
  );
};
