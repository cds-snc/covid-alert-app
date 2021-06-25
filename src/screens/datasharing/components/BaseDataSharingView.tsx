import React, {useCallback, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box} from 'components';
import {useI18n} from 'locale';
import {FormContext} from 'shared/FormContext';
import styles from 'shared/Styles';

import {Toolbar} from './Toolbar';

interface BaseDataSharingViewProps {
  children?: React.ReactNode;
  showBackButton?: boolean;
  closeRoute?: string;
}

export const BaseDataSharingView = ({children, showBackButton = true, closeRoute = ''}: BaseDataSharingViewProps) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => {
    navigation.navigate(closeRoute ? closeRoute : 'Menu');
  }, [closeRoute, navigation]);
  const {data} = useContext(FormContext);

  const wrapperStyle = data.modalVisible ? styles.overlay : styles.invisible;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Box backgroundColor="overlayBackground" flex={1}>
        <SafeAreaView style={styles.flex}>
          <Box style={wrapperStyle} />
          <Box marginBottom="m">
            <Toolbar
              navText={i18n.translate('DataUpload.Close')}
              onIconClicked={close}
              showBackButton={showBackButton}
            />
          </Box>
          <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </SafeAreaView>
      </Box>
    </KeyboardAvoidingView>
  );
};
