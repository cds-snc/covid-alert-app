import React from 'react';
import {StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {Box, Text} from 'components';
import {SystemStatus, useSystemStatus} from 'services/ExposureNotificationService';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useOrientation} from 'shared/useOrientation';
import {useCachedStorage} from 'services/StorageService';
import {useI18n} from 'locale';

import {QrButton} from '../components/QrButton';
import {MenuButton} from '../components/MenuButton';

import {StatusHeaderView} from './StatusHeaderView';

// const windowWidth = Dimensions.get('window').width;

const borderRadius = 16;

export const MenuBar = () => {
  const i18n = useI18n();
  const {orientation} = useOrientation();
  const {qrEnabled} = useCachedStorage();
  const [systemStatus] = useSystemStatus();
  const pixelRatio = PixelRatio.getFontScale();

  const windowWidth = orientation === 'landscape' ? Dimensions.get('window').height : Dimensions.get('window').width;
  const ratio = orientation === 'landscape' ? pixelRatio > 1.4 : pixelRatio > 1;
  const statusHeaderPadding = ratio ? 'none' : 'm';
  const menuButtonPadding = ratio || (qrEnabled && windowWidth <= 320) ? 'm' : 'none';

  const safeAreaPadding = orientation === 'landscape' ? -10 : -20;
  console.log('windowWidth', windowWidth);
  console.log('pixelRatio', pixelRatio);

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
          {/* /* landscape mode, buttons side by side

          */}
          {ratio || (qrEnabled && windowWidth <= 320) ? (
            <Box>
              {qrEnabled ? (
                <Box paddingVertical="m">
                  <QrButton />
                </Box>
              ) : (
                appStatus
              )}
              {menuButtonBox}
            </Box>
          ) : (
            <>
              <Box flex={qrEnabled ? 1.85 : 1} marginRight="s">
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
