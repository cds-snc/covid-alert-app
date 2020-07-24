import React from 'react';

import {Box} from '../Box';

interface ContentProps {
  children?: React.ReactElement;
}

export const SheetContentsContainer = ({children}: ContentProps) => {
  return (
    <>
      <Box minHeight="100%" backgroundColor="overlayBackground" borderRadius={32}>
        <Box marginTop="l">{children}</Box>
      </Box>
    </>
  );
};
