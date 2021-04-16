import React from 'react';
import {StyleSheet, PixelRatio} from 'react-native';
import {Box, Text} from 'components';
import {SystemStatus, useSystemStatus} from 'services/ExposureNotificationService';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useOrientation} from 'shared/useOrientation';
import {useCachedStorage} from 'services/StorageService';

import {QrButton} from '../components/QrButton';
import {MenuButton} from '../components/MenuButton';

import {StatusHeaderView} from './StatusHeaderView';

const borderRadius = 16;

export const MenuBar = () => {
  const {qrEnabled} = useCachedStorage();
  const [systemStatus] = useSystemStatus();
  const pixelRatio = PixelRatio.getFontScale();
  const statusHeaderPadding = pixelRatio > 1.0 ? 'none' : 'm';
  const menuButtonPadding = pixelRatio > 1.0 ? 'm' : 'none';
  const {orientation} = useOrientation();
  const safeAreaPadding = orientation === 'landscape' ? -10 : -20;

  const appStatus = (
    <Text paddingTop="m" paddingBottom={statusHeaderPadding}>
      <StatusHeaderView enabled={systemStatus === SystemStatus.Active} />
    </Text>
  );

  const menuButtonBox = (
    <Box paddingBottom={menuButtonPadding}>
      <MenuButton />
    </Box>
  );

  return (
    <Box style={styles.content} paddingHorizontal="m">
      <SafeAreaView edges={['bottom']} mode="padding" style={{paddingBottom: safeAreaPadding}}>
        <Box style={styles.box}>
          {/* Stack the menu buttons or place in columns */}
          {pixelRatio > 1.0 ? (
            <Box>
              {qrEnabled ? <QrButton /> : appStatus}
              {menuButtonBox}
            </Box>
          ) : (
            <>
              <Box flex={1} marginRight="m">
                {qrEnabled ? <QrButton /> : appStatus}
              </Box>

              <Box flex={1} marginVertical="m">
                {menuButtonBox}
              </Box>
            </>
          )}
        </Box>
      </SafeAreaView>
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
