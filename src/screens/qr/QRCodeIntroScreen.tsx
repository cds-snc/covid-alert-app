import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useCachedStorage} from 'services/StorageService';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';
import {InfoShareItem} from '../menu/components/InfoShareItem';

export const QRCodeIntroScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const {setHasViewedQr} = useCachedStorage();
  const toQRScreen = useCallback(async () => {
    await setHasViewedQr(true);
    navigation.navigate('QRCodeReaderScreen');
  }, [setHasViewedQr, navigation]);
  return (
    <BaseQRCodeScreen>
      <Box backgroundColor="gray4">
        <Text>Placeholder for illustration</Text>
      </Box>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          {i18n.translate('QRCode.ScanAPlace.Title')}
        </Text>

        <Text marginBottom="l">
          <Text>{i18n.translate('QRCode.ScanAPlace.Body')}</Text>
          <Text variant="bodySubTitle">{i18n.translate('QRCode.ScanAPlace.Body2')}</Text>
        </Text>
        <Box marginBottom="m">
          <Button text="Next" variant="thinFlat" onPress={toQRScreen} />
          <InfoShareItem
            text={i18n.translate('QRCode.ScanAPlace.CTA2')}
            onPress={() => console.log('')}
            icon="icon-chevron"
          />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};
