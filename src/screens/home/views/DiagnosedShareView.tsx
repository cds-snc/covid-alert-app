import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {Text, ButtonSingleLine, Box} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import AsyncStorage from '@react-native-community/async-storage';
import {INITIAL_TEK_UPLOAD_COMPLETE} from 'shared/DataSharing';
import {StyleSheet, Platform} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(async () => {
    const initialTekUploadComplete = await AsyncStorage.getItem(INITIAL_TEK_UPLOAD_COMPLETE);
    const screen = initialTekUploadComplete === 'false' ? 'Step2' : 'TekUploadSubsequentDays';
    return navigation.navigate('DataSharing', {screen});
  }, [navigation]);
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  return (
    <BaseHomeView iconName="hand-reminder" testID="diagnosedShare">
      <Box
        alignSelf="stretch"
        style={styles.roundedBox}
        backgroundColor="bodyTitleWhite"
        paddingHorizontal="m"
        paddingVertical="m"
        marginBottom="m"
      >
        <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
          {i18n.translate('Home.DiagnosedShareView.Title')}
        </Text>
        <Text variant="bodyText" color="bodyText" marginBottom="m">
          {i18n.translate('Home.DiagnosedShareView.Body1')}
        </Text>
        <Text variant="bodyText" color="bodyText">
          <Text fontWeight="bold">{i18n.translate('Home.DiagnosedShareView.Body2')}</Text>
          {i18n.translate('Home.DiagnosedShareView.Body3')}
        </Text>
        <Box alignSelf="stretch" marginTop="l" marginBottom="m">
          <ButtonSingleLine
            text={i18n.translate('Home.DiagnosedShareView.ButtonCTA')}
            variant="bigFlatBlue"
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
    marginTop: Platform.OS === 'ios' ? 5 : 20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: -1,
  },
});
