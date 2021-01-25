import React from 'react';
import {BaseDataSharingView} from '../../datasharing/components/BaseDataSharingView';
import {Box, Button, Text, Icon} from 'components';
import {useStorage} from 'services/StorageService';
import {StyleSheet} from 'react-native';
import {log} from 'shared/logging/config';
import AsyncStorage from '@react-native-community/async-storage';

export const QRCodeView = ({route}: any) => {
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
          {/* <Text variant="bodySubTitle" marginBottom="xs">
            Date
          </Text> */}
        </Box>
        <Text marginBottom="xxl"> Thank you for scanning. You have successfully checked in</Text>
        <Button variant="thinFlat" text="Check Storage Values" onPress={retrieveData} />
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

    if (value !== null) {
      log.debug({category: 'debug', payload: value});
    } else {
      console.log('does not exist');
    }
  } catch (error) {}
}

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
  },
});
