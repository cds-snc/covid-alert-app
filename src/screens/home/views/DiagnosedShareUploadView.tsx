import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Text, ButtonSingleLine, Box} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {StyleSheet, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {INITIAL_TEK_UPLOAD_COMPLETE} from 'shared/DataSharing';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareUploadView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(async () => {
    const initialTekUploadComplete = await AsyncStorage.getItem(INITIAL_TEK_UPLOAD_COMPLETE);
    const screen = initialTekUploadComplete === 'false' ? 'IntermediateScreen' : 'TekUploadSubsequentDays';
    return navigation.navigate('DataSharing', {screen});
  }, [navigation]);
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  return (
    <BaseHomeView iconName="hand-reminder-red">
      <Box alignSelf="stretch" style={styles.roundedBox} backgroundColor="bodyTitleWhite">
        <Box paddingHorizontal="m" paddingVertical="m">
          <Text
            focusRef={autoFocusRef}
            variant="bodyTitle"
            color="bodyText"
            marginBottom="m"
            accessibilityRole="header"
          >
            {i18n.translate('Home.DiagnosedShareUploadView.Title')}
          </Text>
          <Text variant="bodyText" color="bodyText" marginBottom="m">
            {i18n.translate('Home.DiagnosedShareUploadView.Body1')}
          </Text>
          <ButtonSingleLine
            text={i18n.translate('Home.DiagnosedShareUploadView.ButtonCTA')}
            variant="dangerWhiteText"
            onPress={toDataShare}
            iconName="icon-chevron-white"
          />
        </Box>
      </Box>
    </BaseHomeView>
  );
};

const styles = StyleSheet.create({
  roundedBox: {
    marginTop: Platform.OS === 'ios' ? 5 : -20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: -1,
  },
});
