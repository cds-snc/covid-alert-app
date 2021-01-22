import React from 'react';
import {BaseDataSharingView} from '../../datasharing/components/BaseDataSharingView';
import {Box, Button, Text} from 'components';
import {useStorage} from 'services/StorageService';

export const QRCodeView = ({route}: any) => {
  const {id, name} = route.params;
  const {checkInID, setCheckIn} = useStorage();
  setCheckIn(id.toString());
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Text>Successful Check-in</Text>
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {urlToString(name)}
        </Text>
        <Button variant="thinFlat" text="Storage" onPress={() => console.log('Check In: ', checkInID)} />
      </Box>
    </BaseDataSharingView>
  );
};

function urlToString(url: string): string {
  const title = url.replace('_', ' ');
  return title;
}
