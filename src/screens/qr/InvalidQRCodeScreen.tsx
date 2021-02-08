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
  const goHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <BaseQRCodeScreen showBackButton={false} showCloseButton={false}>
      <Box paddingHorizontal="m" marginTop="-xl">
        <Icon name="red-circle-exclamation" height={75} width={75} />
      </Box>
      <Box paddingHorizontal="m" marginTop="l" style={styles.flex}>
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.Error.Title')}
        </Text>
        <Box>
          <Text marginBottom="l">{i18n.translate('QRCode.Error.Body')}</Text>
        </Box>

        <Box alignSelf="stretch" marginTop="xl">
          <Button variant="thinFlat" text={i18n.translate('QRCode.Error.CTA2')} onPress={goHome} />
        </Box>
        <Box alignSelf="stretch" marginTop="s" marginBottom="l">
          <Button variant="thinFlatNeutralGrey" text={i18n.translate('QRCode.Error.CTA')} onPress={tryAgain} />
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
