import React, {useCallback} from 'react';
import {Box, Text, ButtonSingleLine, Button} from 'components';
import {ScrollView, StyleSheet, Linking} from 'react-native';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const NoPermission = () => {
  const i18n = useI18n();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('QRCode.CameraPermissions.Title')}
          </Text>

          <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>

          <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
            <Button variant="bigFlat" text="Permission" onPress={toSettings} />
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
