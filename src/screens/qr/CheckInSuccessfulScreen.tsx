import React, {useCallback} from 'react';
import {Box, Button, Text, Icon, InfoBlock} from 'components';
import {useStorage} from 'services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {useI18n} from 'locale';
import {formatCheckInDate} from 'shared/date-fns';

export const CheckInSuccessfulScreen = () => {
  const {checkInHistory, removeCheckIn} = useStorage();
  const mostRecentCheckIn = checkInHistory.slice(-1)[0];
  const formattedCheckInDate = formatCheckInDate(new Date(mostRecentCheckIn.timestamp));
  const i18n = useI18n();
  const navigation = useNavigation();
  const navigateHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Box paddingBottom="l">
          <Icon name="icon-green-check" height={50} width={60} />
          <Text variant="bodySubTitle" marginTop="xl">
            {i18n.translate('QRCode.CheckInView.Title')}
          </Text>
        </Box>
        <Box paddingBottom="l">
          <InfoBlock
            titleBolded={mostRecentCheckIn.name}
            backgroundColor="greenBackground"
            color="bodyText"
            button={{
              text: '',
              action: () => {},
            }}
            text={formattedCheckInDate}
            showButton={false}
          />
        </Box>
      </Box>
      <Box marginTop="l" padding="m">
        <Button variant="thinFlat" text={i18n.translate('QRCode.CheckInView.CTA1')} onPress={navigateHome} />
      </Box>
      <Box margin="m">
        <Button variant="thinFlat" text={i18n.translate('QRCode.CheckInView.CTA2')} onPress={() => removeCheckIn()} />
      </Box>
    </BaseDataSharingView>
  );
};
