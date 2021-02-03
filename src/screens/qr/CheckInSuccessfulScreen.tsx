import React, {useCallback} from 'react';
import {Box, Button, Text, Icon, InfoBlock} from 'components';
import {useStorage} from 'services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {formatCheckInDate} from 'shared/date-fns';
import {CheckInData} from 'shared/qr';
import {StyleSheet} from 'react-native';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

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
    <BaseQRCodeScreen showBackButton={false}>
      <Box paddingHorizontal="m" style={styles.flex}>
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
      <Box marginHorizontal="m" marginBottom="m">
        <Button variant="thinFlat" text={i18n.translate('QRCode.CheckInView.CTA1')} onPress={navigateHome} />
      </Box>
      <Box marginHorizontal="m" marginBottom="l">
        <Button variant="thinFlatGrey" text={i18n.translate('QRCode.CheckInView.CTA2')} onPress={cancelCheckIn} />
      </Box>
    </BaseQRCodeScreen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  button: {
    fontSize: 18,
  },
});
