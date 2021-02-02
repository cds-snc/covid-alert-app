import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {Linking} from 'react-native';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const NoPermission = () => {
  const i18n = useI18n();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          Permission Denied!
        </Text>

        <Text marginBottom="l">Content.</Text>

        <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
          <Button variant="bigFlat" text={i18n.translate('QRCode.CameraPermissions.CTA')} onPress={toSettings} />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};
