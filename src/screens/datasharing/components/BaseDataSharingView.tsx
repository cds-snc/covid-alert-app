import React, {useCallback, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, Toolbar} from 'components';
import {useI18n} from 'locale';
import {FormContext} from '../../../shared/FormContext';

interface BaseDataSharingViewProps {
  children?: React.ReactNode;
}

export const BaseDataSharingView = ({children}: BaseDataSharingViewProps) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);
  const {data} = useContext(FormContext);

  // Note: we can now make back buttons in this flow!
  // const back = useCallback(() => navigation.goBack(), [navigation]);

  const wrapperStyle = data.modalVisible ? styles.overlay : styles.flex;

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Box style={wrapperStyle}>
          <Toolbar
            title=""
            navIcon="icon-back-arrow"
            navText={i18n.translate('DataUpload.Cancel')}
            navLabel={i18n.translate('DataUpload.Cancel')}
            onIconClicked={close}
          />
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
    zIndex: 2,
  },
});
