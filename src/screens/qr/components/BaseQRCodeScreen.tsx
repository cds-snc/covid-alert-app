import React, {useCallback} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, ToolbarWithClose} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import styles from 'shared/Styles';

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
