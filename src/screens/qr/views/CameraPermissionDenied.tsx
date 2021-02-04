import React, {useCallback, useEffect} from 'react';
import {Box, Text, Button} from 'components';
import {AppState, AppStateStatus, Linking, StyleSheet} from 'react-native';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const CameraPermissionDenied = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();
  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => {
    const onAppStateChange = async (newState: AppStateStatus) => {
      if (newState === 'active') {
        updatePermissions();
      }
    };

    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [updatePermissions]);

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
