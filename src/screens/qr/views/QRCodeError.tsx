import React from 'react';
import {Box, Text} from 'components';

export const QRCodeError = ({children}: {children: React.ReactNode}) => {
  return (
    <Box>
      <Text>{children}</Text>
    </Box>
  );
};
