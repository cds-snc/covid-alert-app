import React from 'react';

import {Box} from '../Box';

interface ContentProps {
  children?: React.ReactElement;
}

export const SheetContentsContainer = ({children}: ContentProps) => {
  return (
    <Box backgroundColor="overlayBackground" minHeight="100%">
      <Box marginTop="l">{children}</Box>
    </Box>
  );
};
