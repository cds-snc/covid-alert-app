import React, {useCallback} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, ToolbarWithClose} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

interface BaseQRCodeScreenProps {
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export const BaseQRCodeScreen = ({children, showBackButton}: BaseQRCodeScreenProps) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Box marginBottom="m">
          <ToolbarWithClose
            closeText={i18n.translate('DataUpload.Close')}
            showBackButton={showBackButton}
            onClose={close}
          />
        </Box>
        <ScrollView>
          <View style={styles.flex}>{children}</View>
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
