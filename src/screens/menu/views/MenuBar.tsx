import React from 'react';
import {StyleSheet, PixelRatio} from 'react-native';
import {Box, Text} from 'components';
import {SystemStatus, useSystemStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';

import {QrButton} from '../components/QrButton';
import {MenuButton} from '../components/MenuButton';

import {StatusHeaderView} from './StatusHeaderView';

const borderRadius = 16;

export const MenuBar = () => {
  const {qrEnabled} = useStorage();
  const [systemStatus] = useSystemStatus();
  const pixelRatio = PixelRatio.getFontScale();
  const paddingBottom = pixelRatio > 1.0 ? 'none' : 'm';

  const appStatus = (
    <Text paddingTop="m" paddingBottom={paddingBottom}>
      <StatusHeaderView enabled={systemStatus === SystemStatus.Active} />
    </Text>
  );
  const qrButtonBox = (
    <Box marginVertical="m">
      <QrButton />
    </Box>
  );
  const menuButtonBox = (
    <Box marginVertical="s">
      <MenuButton />
    </Box>
  );

  return (
    <Box style={styles.content} paddingHorizontal="m">
      <Box style={styles.box}>
        {pixelRatio > 1.0 ? (
          <Box>
            {qrEnabled ? qrButtonBox : appStatus}
            {menuButtonBox}
          </Box>
        ) : (
          <>
            <Box flex={3} marginRight="m">
              {qrEnabled ? qrButtonBox : appStatus}
            </Box>

            <Box flex={2} marginVertical="m">
              {menuButtonBox}
            </Box>
          </>
        )}
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
