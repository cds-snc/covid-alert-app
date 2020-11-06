import React from 'react';
import {Box} from 'components';

import {ApiNotConnectedView} from './views/ApiNotConnectedView';

const Content = () => {
  return <ApiNotConnectedView />;
};

export const ErrorScreen = () => {
  return (
    <Box flex={1} alignItems="center" backgroundColor="mainBackground">
      <Box
        flex={1}
        paddingTop="m"
        paddingBottom="m"
        alignSelf="stretch"
        accessibilityElementsHidden={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Content />
      </Box>
    </Box>
  );
};
