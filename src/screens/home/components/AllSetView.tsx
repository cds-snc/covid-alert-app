import React from 'react';
import {Text, TextMultiline} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

export const AllSetView = ({titleText, bodyText, testID}: {titleText: string; bodyText: string; testID?: string}) => {
  const autoFocusRef = useAccessibilityAutoFocus();
  return (
    <>
      <Text
        testID={testID}
        focusRef={autoFocusRef}
        variant="bodyTitle"
        color="bodyText"
        marginBottom="m"
        accessibilityRole="header"
      >
        {titleText}
      </Text>
      <TextMultiline text={bodyText} marginBottom="m" />
    </>
  );
};
