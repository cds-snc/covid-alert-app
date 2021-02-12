import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {useI18n} from 'locale';

export const QRCodeIntroScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const {setHasViewedQr} = useStorage();
  const toQRScreen = useCallback(async () => {
    await setHasViewedQr(true);
    navigation.navigate('QRCodeReaderScreen');
  }, [setHasViewedQr, navigation]);
  return (
    <BaseDataSharingView>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          {i18n.translate('QRCode.ScanAPlace.Title')}
        </Text>

        <Text marginBottom="l">
          <Text>{i18n.translate('QRCode.ScanAPlace.Body')}</Text>
          <Text variant="bodySubTitle">{i18n.translate('QRCode.ScanAPlace.Body2')}</Text>
        </Text>

        <Button text="Next" variant="thinFlat" onPress={toQRScreen} />
      </Box>
    </BaseDataSharingView>
  );
};
