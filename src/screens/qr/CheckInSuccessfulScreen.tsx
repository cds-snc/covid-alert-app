import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button, Text, Icon, InfoBlock, Header} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {CheckInData} from 'shared/qr';
import {formateCheckInSuccessfulDate} from 'shared/date-fns';

import {InfoShareItem} from 'screens/menu/components/InfoShareItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

interface CheckInSuccessfulRoute {
  route: {
    params: CheckInData;
  };
}
export const CheckInSuccessfulScreen = ({route}: CheckInSuccessfulRoute) => {
  const {address, name, timestamp} = route.params;
  const i18n = useI18n();
  const navigation = useNavigation();
  const navigateHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  const navigateYourVisits = useCallback(() => navigation.navigate('CheckInHistoryScreen'), [navigation]);
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const dateAndTime = (address: string) => {
    const formatDate = formateCheckInSuccessfulDate(new Date(timestamp), dateLocale);
    return `${address} \n\n ${formatDate}`;
  };

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Header />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m" paddingTop="m">
            <Icon name="successful-checkin" height={75} width={75} />
          </Box>
          <Box paddingHorizontal="m">
            <Box paddingBottom="l">
              <Text variant="bodyTitle" marginTop="xl">
                {i18n.translate('QRCode.CheckInView.Title')}
              </Text>
            </Box>
            <Box paddingBottom="m">
              <Text>
                {i18n.translate('QRCode.CheckInView.Body1')}
                <Text fontWeight="bold">{i18n.translate('QRCode.CheckInView.Body2')}</Text>
                {i18n.translate('QRCode.CheckInView.Body3')}
              </Text>
            </Box>
            <Box paddingBottom="l">
              <InfoBlock
                titleBolded={name}
                backgroundColor="gray5"
                color="bodyText"
                button={{
                  text: '',
                  action: () => {},
                }}
                text={dateAndTime(address)}
                showButton={false}
              />
            </Box>
            <Box paddingBottom="l">
              <Text>{i18n.translate('QRCode.CheckInView.Body4')}</Text>
            </Box>
          </Box>

          <Box marginHorizontal="m" marginBottom="m">
            <Button
              variant="thinFlatNoBorder"
              text={i18n.translate('QRCode.CheckInView.CTA1')}
              onPress={navigateHome}
            />
          </Box>
          <Box marginHorizontal="m" marginBottom="l">
            <InfoShareItem
              text={i18n.translate('QRCode.CheckInView.CTA2')}
              onPress={navigateYourVisits}
              icon="icon-chevron"
            />
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
