import React, {useCallback} from 'react';
import {Box, Text, Icon, Button} from 'components';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {useI18n} from 'locale';
import {log} from 'shared/logging/config';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

export const LearnAboutQRScreen = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();
  const requestPermissions = useCallback(async () => {
    try {
      await BarCodeScanner.requestPermissionsAsync();
      updatePermissions();
    } catch (err) {
      log.error({category: 'qr-code', message: err.message});
    }
  }, [updatePermissions]);
  return (
    <BaseQRCodeScreen showBackButton>
      <Box paddingHorizontal="m">
        <Icon height={120} width={150} name="no-visit-icon" />
        <Text variant="bodyTitle" marginTop="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.LearnAboutQRScan.Title')}
        </Text>

        <Text marginVertical="s">{i18n.translate('QRCode.LearnAboutQRScan.Body1')}</Text>
        <Text>{i18n.translate('QRCode.LearnAboutQRScan.Body2')}</Text>
        <Box marginTop="xl" marginBottom="l">
          <Button
            text={i18n.translate('QRCode.ScanAPlace.CTA')}
            variant="thinFlatNoBorder"
            onPress={requestPermissions}
          />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};
