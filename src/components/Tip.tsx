import React from 'react';
import {Box, Icon} from 'components';

interface Props {
  children: React.ReactElement;
}

export const Tip = ({children}: Props) => {
  return (
    <Box
      backgroundColor="green2"
      borderRadius={10}
      paddingVertical="m"
      paddingLeft="s"
      paddingRight="m"
      flexDirection="row"
      marginTop="m"
      marginBottom="xl"
    >
      <Box flex={0} paddingTop="xxs" marginRight="xxs">
        <Icon name="icon-light-bulb" size={40} />
      </Box>
      <Box flex={1}>{children}</Box>
    </Box>
  );
};
