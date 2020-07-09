import React from 'react';
import {Text, TextMultiline} from 'components';

import {BaseHomeView} from './BaseHomeView';

export const AllSetView = ({titleText, bodyText}: {titleText: string; bodyText: string}) => {
  return (
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {titleText}
      </Text>
      <TextMultiline text={bodyText} marginBottom="m" />
    </BaseHomeView>
  );
};
