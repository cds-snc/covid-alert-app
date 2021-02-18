import React from 'react';
import {Text, TextMultiline} from 'components';

export const AllSetView = ({titleText, bodyText, testID}: {titleText: string; bodyText: string; testID?: string}) => {
  return (
    <>
      <Text testID={testID} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {titleText}
      </Text>
      <TextMultiline text={bodyText} marginBottom="m" />
    </>
  );
};
