import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {StyleSheet} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const RequestCameraPermission = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();

  const requestPermissions = useCallback(async () => {
    await BarCodeScanner.requestPermissionsAsync();
    updatePermissions();
  }, [updatePermissions]);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <Box paddingHorizontal="m" style={styles.flex}>
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.CameraPermissions.Title')}
        </Text>
        <Box style={styles.flex}>
          <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>
          <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body2')}</Text>
        </Box>

        <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
          <Button
            variant="thinFlat"
            text={i18n.translate('QRCode.CameraPermissions.CTA')}
            onPress={requestPermissions}
          />
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
