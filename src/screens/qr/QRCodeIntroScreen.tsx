import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {InfoShareItem} from 'screens/menu/components/InfoShareItem';
import {StyleSheet} from 'react-native';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

export const QRCodeIntroScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const toQRScreen = useCallback(async () => {
    navigation.navigate('QRCodeReaderScreen');
  }, [navigation]);
  return (
    <BaseQRCodeScreen>
      <Box paddingHorizontal="m">
        <Box backgroundColor="gray5" style={styles.illustrationStyle} marginBottom="l">
          <Text>Placeholder for illustration</Text>
        </Box>
        <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.ScanAPlace.Title')}
        </Text>
        <Text marginBottom="m">{i18n.translate('QRCode.ScanAPlace.Body')}</Text>
        <Text marginBottom="s">
          <Text variant="bodySubTitle">{i18n.translate('QRCode.ScanAPlace.Body2')}</Text>
          <Text>{i18n.translate('QRCode.ScanAPlace.Body3')}</Text>
        </Text>

        <Box paddingTop="m" marginBottom="m">
          <Button text={i18n.translate('QRCode.ScanAPlace.CTA')} variant="thinFlatNoBorder" onPress={toQRScreen} />
        </Box>
        <Box marginBottom="xxl">
          <InfoShareItem
            text={i18n.translate('QRCode.ScanAPlace.CTA2')}
            onPress={() => {
              navigation.navigate('QRCodeOnboard');
            }}
            icon="icon-chevron"
          />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};

const styles = StyleSheet.create({
  illustrationStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
});
