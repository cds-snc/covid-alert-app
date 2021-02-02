import React, {useCallback} from 'react';
import {Box, Text, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {BarCodeScanner} from 'expo-barcode-scanner';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const NoCamera = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();

  const requestPermissions = useCallback(async () => {
    await BarCodeScanner.requestPermissionsAsync();
    updatePermissions();
  }, [updatePermissions]);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.CameraPermissions.Title')}
        </Text>

        <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>

        <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
          <ButtonSingleLine
            text={i18n.translate('QRCode.CameraPermissions.CTA')}
            variant="thinFlat"
            onPress={requestPermissions}
          />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};
