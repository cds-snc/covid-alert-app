import React, {useCallback} from 'react';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {StyleSheet} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'components/Icon';

import {BaseQRCodeScreen} from '../components/BaseQRCodeScreen';

export const RequestCameraPermission = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();
  const navigation = useNavigation();

  const goHome = useCallback(() => navigation.navigate('Home'), [navigation]);

  const requestPermissions = useCallback(async () => {
    await BarCodeScanner.requestPermissionsAsync();
    updatePermissions();
  }, [updatePermissions]);
  return (
    <BaseQRCodeScreen showBackButton showCloseButton={false}>
      <Box paddingHorizontal="m" style={styles.flex}>
        <Icon size={50} name="camera-permission" />
        <Text variant="bodyTitle" marginVertical="m" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('QRCode.CameraPermissions.Title')}
        </Text>
        <Box style={styles.flex}>
          <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>

          <Text fontWeight="bold" marginBottom="s">
            {i18n.translate('QRCode.CameraPermissions.Title2')}
          </Text>
          <Text marginBottom="s">{i18n.translate('QRCode.CameraPermissions.Body2')}</Text>
        </Box>

        <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
          <Box marginBottom="m">
            <Button
              variant="thinFlat"
              text={i18n.translate('QRCode.CameraPermissions.CTA')}
              onPress={requestPermissions}
            />
          </Box>
          <Box marginBottom="m">
            <Button variant="thinFlatGrey" text={i18n.translate('QRCode.CameraPermissions.Cancel')} onPress={goHome} />
          </Box>
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
