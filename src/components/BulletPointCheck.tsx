import React from 'react';
import {Box, Text, Icon} from 'components';

export const BulletPointCheck = ({text}: {text: string}) => {
  return (
    <Box flexDirection="row" marginBottom="l">
      <Box marginTop="xxs">
        <Icon size={20} name="icon-green-check" />
      </Box>
      <Text variant="bodyText" color="overlayBodyText" marginLeft="m">
        {text}
      </Text>
    </Box>
  );
};
