import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box} from 'components';
import {useI18n} from 'locale';

import {Toolbar} from './Toolbar';

interface BaseQRCodeScreenProps {
  children?: React.ReactNode;
  showBackButton?: boolean;
  showCloseButton?: boolean;
}

export const BaseQRCodeScreen = ({children, showBackButton, showCloseButton}: BaseQRCodeScreenProps) => {
  const i18n = useI18n();
  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Box marginBottom="m">
          <Toolbar
            navText={i18n.translate('DataUpload.Close')}
            showBackButton={showBackButton}
            showCloseButton={showCloseButton}
            useWhiteText={false}
          />
        </Box>
        <View style={styles.flex}>{children}</View>
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
