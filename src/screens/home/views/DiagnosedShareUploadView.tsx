import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Text, ButtonSingleLine, Box} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareUploadView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  return (
    <BaseHomeView iconName="hand-reminder-red" testID="diagnosed">
      <Box
        paddingLeft="m"
        paddingRight="m"
        paddingBottom="m"
        paddingTop="xl"
        borderRadius={10}
        backgroundColor="bodyTitleWhite"
      >
        <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
          {i18n.translate('Home.DiagnosedShareUploadView.Title')}
        </Text>
        <Text variant="bodyText" color="bodyText" marginBottom="m">
          {i18n.translate('Home.DiagnosedShareUploadView.Body1')}
        </Text>
        <ButtonSingleLine
          text={i18n.translate('Home.DiagnosedShareUploadView.ButtonCTA')}
          variant="dangerWhiteText"
          onPress={() => {}}
          iconName="icon-chevron-white"
        />
      </Box>
    </BaseHomeView>
  );
};
