import React, {useCallback, useEffect} from 'react';
import {Box, Text, Button, ButtonSingleLine} from 'components';
import {AppState, AppStateStatus, Linking, StyleSheet} from 'react-native';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const CameraPermissionDenied = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();
  const navigation = useNavigation();
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
    <BaseQRCodeScreen>
      <Box paddingHorizontal="m" style={styles.flex}>
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.CameraPermissionDenied.Title')}
        </Text>

        <Box style={styles.flex}>
          <Text marginBottom="l"> {i18n.translate('QRCode.CameraPermissionDenied.Body')}</Text>
        </Box>
        <Box paddingHorizontal="s" paddingTop="xl" marginBottom="m">
          <Button variant="thinFlat" text={i18n.translate('QRCode.CameraPermissionDenied.CTA')} onPress={toSettings} />
        </Box>

        <Box paddingHorizontal="s" marginBottom="m">
          <ButtonSingleLine
            text={i18n.translate('QRCode.CameraPermissionDenied.CTA2')}
            variant="thinFlatNeutralGrey"
            onPress={() => {
              navigation.navigate('LearnAboutQRScreen');
            }}
            iconName="icon-chevron"
          />
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
