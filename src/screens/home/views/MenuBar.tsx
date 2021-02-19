import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useSystemStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';

import {useNotificationPermissionStatus} from '../components/NotificationPermissionStatus';

import {MenuBarNoQr} from './MenuBarNoQr';

const borderRadius = 16;

export const MenuBar = () => {
  const {qrEnabled} = useStorage();
  const i18n = useI18n();
  const navigation = useNavigation();
  const openMenu = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);
  const openScan = useCallback(() => {
    navigation.navigate('QRCodeFlow');
  }, [navigation]);
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();
  const showNotificationWarning = notificationStatus !== 'granted';

  const menuBarQr = (
    <Box style={styles.box} marginVertical="s">
      <Box marginHorizontal="m">
        <Button
          text={i18n.translate('QRCode.CTA')}
          variant="bigFlatNeutralGrey"
          onPress={openScan}
          iconNameLeft="qr-code-icon"
          borderRadius={8}
        />
      </Box>
      <Box marginHorizontal="m">
        <Button
          text="Menu"
          variant="bigFlatNeutralGrey"
          onPress={openMenu}
          iconNameLeft="hamburger-menu"
          borderRadius={8}
        />
      </Box>
    </Box>
  );
  const menuBarNoQr = <MenuBarNoQr status={systemStatus} notificationWarning={showNotificationWarning} />;
  return (
    <Box style={styles.content} paddingVertical="s">
      {qrEnabled ? menuBarQr : menuBarNoQr}
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {
    width: '100%',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: borderRadius,
    elevation: 10,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
