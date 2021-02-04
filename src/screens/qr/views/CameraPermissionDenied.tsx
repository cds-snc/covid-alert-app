import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {Linking, StyleSheet} from 'react-native';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const CameraPermissionDenied = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const toSettings = useCallback(() => {
    Linking.openSettings();
    // @note we can look into updating this later to look for updated state
    // for now linking back to home after linking out to settings
    navigation.navigate('Home');
  }, []);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <Box paddingHorizontal="m" style={styles.flex}>
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          Permission Denied!
        </Text>

        <Box style={styles.flex}>
          <Text marginBottom="l">Content.</Text>
        </Box>
        <Box paddingHorizontal="s" paddingTop="xl" marginBottom="m">
          <Button variant="thinFlat" text={i18n.translate('QRCode.CameraPermissions.CTA')} onPress={toSettings} />
        </Box>
      </Box>
    </BaseQRCodeScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
