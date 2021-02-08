import React from 'react';
import {Box, Text} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {CheckInData} from 'shared/qr';
import {formatCheckInDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

const CheckInList = ({checkIns}: {checkIns: CheckInData[]}) => {
  if (checkIns.length === 0) {
    return <Text>No Check-ins yet</Text>;
  }
  return (
    <>
      {checkIns.map((checkIn, index) => {
        return (
          <Box marginBottom="l" key={checkIn.id.concat(index.toString())}>
            <Text>ID: {checkIn.id}</Text>
            <Text>Name: {checkIn.name}</Text>
            <Text>Address: {checkIn.address}</Text>
            <Text>Time: {formatCheckInDate(new Date(checkIn.timestamp))}</Text>
          </Box>
        );
      })}
    </>
  );
};

export const CheckInHistoryScreen = () => {
  const {checkInHistory} = useOutbreakService();
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          Check-in History
        </Text>
        <Box>
          <CheckInList checkIns={checkInHistory} />
        </Box>
      </Box>
    </BaseDataSharingView>
  );
};
