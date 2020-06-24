import React from 'react';
import {Box, Text} from 'components';

export const OnboardingHeader = ({text}: {text: string}) => {
  return (
    <Box marginTop="m">
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
        {text}
      </Text>
    </Box>
  );
};
