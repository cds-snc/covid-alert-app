import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {InfoShareItem} from 'screens/menu/components/InfoShareItem';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

export const QRCodeIntroScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const toLearnAboutQRScreen = useCallback(() => {
    navigation.navigate('LearnAboutQRScreen');
  }, [navigation]);
  return (
    <BaseQRCodeScreen>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
          {i18n.translate('QRCode.ScanAPlace.Title')}
        </Text>
        <Text marginBottom="m">{i18n.translate('QRCode.ScanAPlace.Body')}</Text>
        <Text marginBottom="l">
          <Text variant="bodySubTitle">{i18n.translate('QRCode.ScanAPlace.Body2')}</Text>
          <Text>{i18n.translate('QRCode.ScanAPlace.Body3')}</Text>
        </Text>

        <Box paddingHorizontal="s" paddingTop="xl" marginBottom="m">
          <Button text="Next" variant="thinFlatNoBorder" onPress={toLearnAboutQRScreen} />
        </Box>
        <Box paddingHorizontal="s" marginBottom="m">
          <InfoShareItem text={i18n.translate('QRCode.ScanAPlace.CTA2')} onPress={() => {}} icon="icon-chevron" />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};
