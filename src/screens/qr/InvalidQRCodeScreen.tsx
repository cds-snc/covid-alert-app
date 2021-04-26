import React, {useCallback} from 'react';
import {Box, Text, Icon, Button} from 'components';
import {StyleSheet} from 'react-native';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

export const InvalidQRCodeScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const tryAgain = useCallback(() => navigation.navigate('QRCodeReaderScreen'), [navigation]);
  return (
    <BaseQRCodeScreen showBackButton>
      <Box paddingHorizontal="m" marginTop="m">
        <Icon name="qr-code-invalid" height={75} width={75} />
      </Box>
      <Box paddingHorizontal="m" style={styles.flex}>
        <Box marginTop="l">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('QRCode.Error.Title')}
          </Text>
        </Box>

        <Box>
          <Text marginBottom="l">{i18n.translate('QRCode.Error.Body')}</Text>
        </Box>

        <Box alignSelf="stretch" marginVertical="m">
          <Button variant="thinFlatNoBorder" text={i18n.translate('QRCode.Error.CTA')} onPress={tryAgain} />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  invisible: {
    display: 'none',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 2,
  },
});
