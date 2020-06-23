import React, {useCallback} from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Linking} from 'react-native';
import {Text, Box, ButtonMultiline} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const BluetoothDisabledView = () => {
  const [i18n] = useI18n();
  const onActionHow = useCallback(() => {
    Linking.openURL(i18n.translate('Home.HowUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.BluetoothDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.EnableBluetoothCTA')}
      </Text>

      <Box alignSelf="stretch" marginTop="s" marginBottom="xl">
        <ButtonMultiline
          text={i18n.translate('Home.ExposureDetected.DiagnosedBtnText1')}
          text1={i18n.translate('Home.ExposureDetected.DiagnosedBtnText2')}
          variant="bigFlat"
          internalLink
          onPress={onActionHow}
        />
      </Box>
    </BaseHomeView>
  );
};
