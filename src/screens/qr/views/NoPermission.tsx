import React, {useCallback} from 'react';
import {Box, Text, ButtonSingleLine, Button} from 'components';
import {StyleSheet, Linking, View} from 'react-native';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const NoPermission = () => {
  const i18n = useI18n();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <Box paddingHorizontal="m" style={styles.flex}>
        <Box style={styles.flex}>
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('QRCode.CameraPermissions.Title')}
          </Text>

          <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>
        </Box>

        <Box paddingHorizontal="s" paddingTop="xl" marginBottom="m">
          <Button variant="thinFlat" text={i18n.translate('QRCode.CameraPermissions.CTA')} onPress={toSettings} />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
