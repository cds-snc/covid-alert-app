import React, {useCallback} from 'react';
import {Box, Text, ButtonSingleLine} from 'components';
import {ScrollView, StyleSheet} from 'react-native';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const NoPermission = () => {
  const i18n = useI18n();
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('QRCode.CameraPermissions.Title')}
          </Text>

          <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>

          <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
            <ButtonSingleLine
              text={i18n.translate('QRCode.Error.CTA')}
              variant="bigFlatNeutralGrey"
              internalLink
              onPress={() => {}}
            />
          </Box>
        </Box>
      </ScrollView>
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
