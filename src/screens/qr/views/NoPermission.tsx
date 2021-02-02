import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {Linking, StyleSheet} from 'react-native';
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
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          Permission Denied!
        </Text>

        <Box style={styles.flex}>
          <Text marginBottom="l">Content.</Text>
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
