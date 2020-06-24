import React from 'react';
import {Box, Text} from 'components';

interface BulletPointProps {
  text: string;
}

export const BulletPoint = ({text}: BulletPointProps) => {
  return (
    <Box flexDirection="row">
      <Box marginRight="xs">
        <Text variant="bodyText" color="bodyText">
          {'\u25CF'}
        </Text>
      </Box>
      <Text variant="bodyText" color="bodyText">
        {text}
      </Text>
    </Box>
  );
};
