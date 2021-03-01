import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {SystemStatus, useSystemStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {StatusHeaderView} from 'screens/home/views/StatusHeaderView';

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

  const qrButton = (
    <Button
      text={i18n.translate('QRCode.CTA')}
      variant="qrButton"
      onPress={openScan}
      iconNameLeft="qr-code-icon"
      borderRadius={8}
    />
  );

  const appStatus = (
    <Box paddingRight="m" maxWidth={240}>
      <StatusHeaderView enabled={systemStatus === SystemStatus.Active} />
    </Box>
  );
  return (
    <Box style={styles.content} paddingVertical="m" paddingHorizontal="m">
      <Box style={styles.box}>
        {qrEnabled ? qrButton : appStatus}
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
};
const styles = StyleSheet.create({
  content: {
    width: '100%',
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