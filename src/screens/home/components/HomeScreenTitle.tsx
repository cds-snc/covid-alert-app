import React from 'react';
import {Text} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

export const HomeScreenTitle = ({testID = 'bodyTitle', children}: {testID?: string; children: React.ReactNode}) => {
  const autoFocusRef = useAccessibilityAutoFocus();
  return (
    <Text
      focusRef={autoFocusRef}
      testID={testID}
      variant="bodyTitle"
      color="bodyText"
      marginBottom="m"
      accessibilityRole="header"
    >
      {children}
    </Text>
  );
};
