import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import {Box, Button, Text, Icon, InfoBlock} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {CheckInData} from 'shared/qr';
import {useOutbreakService} from 'services/OutbreakService';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

interface CheckInSuccessfulRoute {
  route: {
    params: CheckInData;
  };
}
export const CheckInSuccessfulScreen = ({route}: CheckInSuccessfulRoute) => {
  const {address, name} = route.params;
  const {removeCheckIn} = useOutbreakService();
  const i18n = useI18n();
  const navigation = useNavigation();
  const navigateHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  const popAlert = useCallback(() => Alert.alert('', i18n.translate('QRCode.CancelCheckIn.Title')), [i18n]);
  const cancelCheckIn = useCallback(() => {
    removeCheckIn();
    popAlert();
    navigateHome();
  }, [removeCheckIn, popAlert, navigateHome]);

  return (
    <BaseQRCodeScreen>
      <Box paddingHorizontal="m" marginTop="-xl">
        <Icon name="green-circle-check" height={75} width={75} />
      </Box>
      <Box paddingHorizontal="m">
        <Box paddingBottom="l">
          <Text variant="bodySubTitle" marginTop="xl">
            {i18n.translate('QRCode.CheckInView.Title')}
          </Text>
        </Box>
        <Box paddingBottom="l">
          <InfoBlock
            titleBolded={name}
            backgroundColor="lightGreenBackground"
            color="bodyText"
            button={{
              text: '',
              action: () => {},
            }}
            text={address}
            showButton={false}
          />
        </Box>
      </Box>
      <Box marginHorizontal="m" marginBottom="m">
        <Button variant="thinFlat" text={i18n.translate('QRCode.CheckInView.CTA1')} onPress={navigateHome} />
      </Box>
      <Box marginHorizontal="m" marginBottom="l">
        <Button variant="thinFlatGrey" text={i18n.translate('QRCode.CheckInView.CTA2')} onPress={cancelCheckIn} />
      </Box>
    </BaseQRCodeScreen>
  );
};
