import React from 'react';
import {BaseDataSharingView} from '../../datasharing/components/BaseDataSharingView';
import {Box, Button, Text, Icon} from 'components';
import {useStorage} from 'services/StorageService';
import {StyleSheet} from 'react-native';
import {log} from 'shared/logging/config';

export const QRCodeView = ({route}: any) => {
  const {id, name} = route.params;
  const {checkInID, setCheckIn, removeCheckIn} = useStorage();
  setCheckIn(id.toString());
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
        <Text marginBottom="m"> Thank you for scanning. You have successfully checked in</Text>

        <Button
          variant="thinFlat"
          text="Check Storage"
          onPress={() => log.debug({category: 'debug', payload: checkInID})}
        />
        {/* <Button variant="thinFlat" text="Cancel Check In" onPress={() => log.debug({category: 'debug', payload: checkInID})} /> */}
      </Box>
    </BaseDataSharingView>
  );
};

function urlToString(url: string): string {
  const title = url.replace('_', ' ');
  return title;
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
