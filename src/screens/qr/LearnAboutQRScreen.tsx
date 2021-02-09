import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';

export const LearnAboutQRScreen = () => {
  const navigation = useNavigation();
  const {setHasViewedQr} = useStorage();
  const toQRScreen = useCallback(async () => {
    await setHasViewedQr(true);
    navigation.navigate('QRCodeReaderScreen');
  }, [setHasViewedQr, navigation]);
  return (
    <BaseDataSharingView>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          Learn more about QR codes
        </Text>
        <Text marginBottom="l">Content.</Text>
        <Button text="Next" variant="bigFlatBlue" onPress={toQRScreen} />
      </Box>
    </BaseDataSharingView>
  );
};
