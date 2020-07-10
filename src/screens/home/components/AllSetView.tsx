import React from 'react';
import {Text, TextMultiline} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseHomeView} from './BaseHomeView';

export const AllSetView = ({
  isBottomSheetExpanded,
  titleText,
  bodyText,
}: {
  isBottomSheetExpanded: boolean;
  titleText: string;
  bodyText: string;
}) => {
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  return (
    <BaseHomeView iconName="thumbs-up">
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {titleText}
      </Text>
      <TextMultiline text={bodyText} marginBottom="m" />
    </BaseHomeView>
  );
};
