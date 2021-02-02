import React from 'react';
import {Box, Text} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {useStorage} from 'services/StorageService';

// what we should be storing:
export interface CheckInData {
  id: string;
  name: string;
  timestamp: number;
}

const CheckInList = ({checkIns}: {checkIns: string[] | string}) => {
  console.log("checkIns", checkIns);
  if (!Array.isArray(checkIns)) {
    return <Text>No Check-ins yet</Text>;
  }
  return (
    <>
      {checkIns.map((locationId, index) => {
        return (
          <Text marginBottom="l" key={locationId.concat(index.toString())}>
            {locationId}
          </Text>
        );
      })}
    </>
  );
};

export const CheckInHistoryScreen = () => {
  const {checkInIDJson} = useStorage();
  console.log('checkInIDJson', {checkInIDJson});
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          Check-in History
        </Text>
        <Box>
          <CheckInList checkIns={checkInIDJson} />
        </Box>
      </Box>
    </BaseDataSharingView>
  );
};
