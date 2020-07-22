import React from 'react';

import {Box} from '../Box';

interface ContentProps {
  children?: React.ReactElement;
}

export const SheetContentsContainer = ({children}: ContentProps) => {
  return (
    <Box backgroundColor="overlayBackground" minHeight="100%" borderWidth={1} borderColor="gray2" borderRadius={32}>
      <Box marginTop="l">{children}</Box>
    </Box>
  );
};
