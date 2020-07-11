import React from 'react';
import {Box, Text, Icon} from 'components';

export const BulletPointX = ({text}: {text: string}) => {
  return (
    <Box flexDirection="row" marginBottom="m">
      <Box marginTop="xxs">
        <Icon size={20} name="icon-x" />
      </Box>
      <Text variant="bodyText" color="overlayBodyText" marginLeft="m">
        {text}
      </Text>
    </Box>
  );
};
