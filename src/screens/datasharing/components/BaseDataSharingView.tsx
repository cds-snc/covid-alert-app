import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box} from 'components';
import {useI18n} from 'locale';

import {Toolbar} from './Toolbar';

interface BaseDataSharingViewProps {
  children?: React.ReactNode;
  overlay?: boolean;
  showBackButton?: boolean;
}

export const BaseDataSharingView = ({children, overlay, showBackButton = true}: BaseDataSharingViewProps) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);

  const wrapperStyle = overlay ? styles.overlay : styles.flex;

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Box style={wrapperStyle}>
          <Toolbar navText={i18n.translate('DataUpload.Close')} onIconClicked={close} showBackButton={showBackButton} />
          <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 500000,
  },
});
