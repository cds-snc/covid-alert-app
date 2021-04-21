import React, {useCallback} from 'react';
import {Box, Text, Icon, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useCachedStorage} from 'services/StorageService';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

export const LearnAboutQRScreen = ({updatePermissions}: {updatePermissions: () => void}) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const {setHasViewedQr} = useCachedStorage();
  const toQRScreen = useCallback(async () => {
    await setHasViewedQr(true);
    navigation.navigate('QRCodeReaderScreen');
  }, [setHasViewedQr, navigation]);
  const requestPermissions = useCallback(async () => {
    await BarCodeScanner.requestPermissionsAsync();
    updatePermissions();
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
        <Box marginTop="xl">
          <Button text="Next" variant="thinFlatNoBorder" onPress={requestPermissions} />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};
