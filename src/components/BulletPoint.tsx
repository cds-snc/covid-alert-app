import React from 'react';
import {Box, Text} from 'components';

interface BulletPointProps {
  text: string;
}

export const BulletPoint = ({text}: BulletPointProps) => {
  const bullet = '\u25CF';
  return (
    <Box flexDirection="row">
      <Box marginRight="xs">
        <Text variant="bodyText" color="bodyText">
          {bullet}
        </Text>
      </Box>
      <Text variant="bodyText" color="bodyText">
        {text}
      </Text>
    </Box>
  );
};
