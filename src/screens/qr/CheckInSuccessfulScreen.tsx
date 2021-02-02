import React, {useCallback} from 'react';
import {Box, Button, Text, Icon, InfoBlock} from 'components';
import {useStorage} from 'services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {useI18n} from 'locale';
import {formatCheckInDate} from 'shared/date-fns';
import {CheckInData} from 'shared/qr';

interface CheckInSuccessfulRoute {
  route: {
    params: CheckInData;
  };
}
export const CheckInSuccessfulScreen = ({route}: CheckInSuccessfulRoute) => {
  const {name, timestamp} = route.params;
  const {removeCheckIn} = useStorage();
  const formattedCheckInDate = formatCheckInDate(new Date(timestamp));
  const i18n = useI18n();
  const navigation = useNavigation();
  const navigateHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  const cancelCheckIn = useCallback(() => {
    removeCheckIn();
    navigateHome();
  }, [removeCheckIn, navigateHome]);

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
            titleBolded={name}
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
        <Button variant="thinFlat" text={i18n.translate('QRCode.CheckInView.CTA2')} onPress={cancelCheckIn} />
      </Box>
    </BaseDataSharingView>
  );
};
