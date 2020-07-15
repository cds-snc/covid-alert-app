import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {Text, ButtonSingleLine, Box} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(() => navigation.navigate('DataSharing'), [navigation]);
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  return (
    <BaseHomeView iconName="hand-reminder">
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
      <Box alignSelf="stretch" marginTop="l" marginBottom="xl">
        <ButtonSingleLine
          text={i18n.translate('Home.DiagnosedShareView.ButtonCTA')}
          variant="bigFlat"
          onPress={toDataShare}
          iconName="icon-chevron-white"
        />
      </Box>
    </BaseHomeView>
  );
};
