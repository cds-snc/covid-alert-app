import React from 'react';
import {Box, Text} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';

export const LearnAboutQRScreen = () => {
  return (
    <BaseDataSharingView>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          Learn more about QR codes
        </Text>
        <Text marginBottom="l">Content.</Text>
      </Box>
    </BaseDataSharingView>
  );
};
