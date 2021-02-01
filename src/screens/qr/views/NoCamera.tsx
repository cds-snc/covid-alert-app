import React, {useCallback} from 'react';
import {Box, Text, Toolbar, ButtonSingleLine} from 'components';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {useNavigation} from '@react-navigation/native';

export const NoCamera = ({updatePermissions}: {updatePermissions: () => void}) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const requestPermissions = useCallback(async () => {
    await BarCodeScanner.requestPermissionsAsync();
    updatePermissions();
  }, []);
  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Box marginBottom="m">
          <Toolbar
            title=""
            navText={i18n.translate('RegionPicker.Close')}
            navLabel={i18n.translate('RegionPicker.Close')}
            navIcon="icon-back-arrow"
            onIconClicked={close}
          />
        </Box>
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m">
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
              {i18n.translate('QRCode.CameraPermissions.Title')}
            </Text>

            <Text marginBottom="l">{i18n.translate('QRCode.CameraPermissions.Body')}</Text>

            <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
              <ButtonSingleLine
                text={i18n.translate('QRCode.CameraPermissions.CTA')}
                variant="thinFlat"
                onPress={requestPermissions}
              />
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
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
