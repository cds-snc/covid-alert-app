import React from 'react';
import {Box, Text, Icon} from 'components';

export const BulletPointCheck = ({text}: {text: string}) => {
  return (
    <Box flexDirection="row" marginBottom="s">
      <Box marginTop="xxs" flex={0}>
        <Icon size={20} name="icon-green-check" />
      </Box>
      <Box flex={1}>
        <Text variant="bodyText" color="overlayBodyText" marginLeft="m">
          {text}
        </Text>
      </Box>
    </Box>
  );
};
