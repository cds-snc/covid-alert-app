import React from 'react';
import {Text} from 'components';

import {BaseHomeView} from './BaseHomeView';

export const AllSetView = ({titleText, bodyText}: {titleText: string; bodyText: string}) => {
  return (
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {titleText}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {bodyText}
      </Text>
    </BaseHomeView>
  );
};
