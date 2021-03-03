import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {SystemStatus, useSystemStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';

import {StatusHeaderView} from './StatusHeaderView';
import {QrButton} from '../components/QrButton';

const borderRadius = 16;

export const MenuBar = () => {
  const {qrEnabled} = useStorage();
  const navigation = useNavigation();
  const openMenu = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);
  const [systemStatus] = useSystemStatus();

  const appStatus = (
    <Box paddingRight="m">
      <StatusHeaderView enabled={systemStatus === SystemStatus.Active} />
    </Box>
  );
  return (
    <Box style={styles.content} paddingVertical="m" paddingHorizontal="m">
      <Box style={styles.box}>
        <Box flex={3} marginRight="m">
          {qrEnabled ? <QrButton /> : appStatus}
        </Box>
        <Box flex={2}>
          <Button
            text="Menu"
            variant="bigFlatNeutralGrey"
            onPress={openMenu}
            iconNameLeft="hamburger-menu"
            borderRadius={8}
            alignLeft
          />
        </Box>
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
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
