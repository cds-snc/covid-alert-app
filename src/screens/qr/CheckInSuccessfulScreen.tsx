import React from 'react';
import {Box, Button, Text, Icon} from 'components';
import {useStorage} from 'services/StorageService';
import {log} from 'shared/logging/config';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';

export const CheckInSuccessfulScreen = ({route}: any) => {
  const {name} = route.params;
  const {checkInIDJson, setRemoveCheckIn} = useStorage();

  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m" alignItems="center">
        <Box paddingBottom="l">
          <Icon name="icon-green-check" height={120} width={150} />
          <Text variant="bodySubTitle" marginTop="m">
            Successful Check-in
          </Text>
        </Box>
        <Box paddingBottom="l">
          <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
            {urlToString(name)}
          </Text>
          <Text variant="bodySubTitle" marginBottom="xs">
            Date
          </Text>
        </Box>
        <Text marginBottom="xl"> Thank you for scanning. You have successfully checked in</Text>
      </Box>
      <Box marginTop="l" padding="m">
        <Button variant="thinFlat" text="Check  Values" onPress={retrieveData} />
      </Box>
      <Box margin="m">
        <Button variant="thinFlat" text="Cancel Check In" onPress={() => setRemoveCheckIn(checkInIDJson)} />
      </Box>
    </BaseDataSharingView>
  );
};

function urlToString(url: string): string {
  const title = url.replace('_', ' ');
  return title;
}

async function retrieveData() {
  try {
    const value = await AsyncStorage.getItem('CheckInID');

    if (value) {
      log.debug({category: 'debug', payload: value});
    } else {
      log.error({category: 'debug', error: 'does not exist'});
    }
  } catch (error) {
    log.error({category: 'debug', error});
  }
}
