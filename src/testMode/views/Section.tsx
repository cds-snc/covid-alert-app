import React from 'react';
import {Box} from 'components';

export interface SectionProps {
  children?: React.ReactNode;
}

export const Section = ({children}: SectionProps) => {
  return (
    (children && (
      <Box borderBottomColor="divider" borderBottomWidth={0.5} paddingTop="s" paddingBottom="s">
        {children}
      </Box>
    )) ||
    null
  );
};
