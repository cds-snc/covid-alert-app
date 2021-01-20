import React from 'react';
import {BaseDataSharingView} from '../../datasharing/components/BaseDataSharingView';
import {Box, Text} from 'components';

export const QRCodeView = () => {
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          QR Code Test Screen
        </Text>
        <Text marginBottom="l">
          <Text>This is a demo screen to test deep link functionality</Text>
        </Text>
        <Text marginBottom="l">
          <Text>
            The only way to access this screen is by scanning a QR Code or by typing covidalert://QRCodeScreen into your
            browser.
          </Text>
        </Text>
      </Box>
    </BaseDataSharingView>
  );
};
