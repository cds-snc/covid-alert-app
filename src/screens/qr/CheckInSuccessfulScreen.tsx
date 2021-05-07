import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button, Text, Icon, Header} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {CheckInData} from 'shared/qr';
import {accessibilityReadableDate, getScannedTime, formatExposedDate} from 'shared/date-fns';
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
  const navigateYourVisits = useCallback(() => navigation.navigate('CheckInHistoryScreen', {closeRoute: 'Home'}), [
    navigation,
  ]);
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const readableDate = accessibilityReadableDate(new Date(timestamp));
  const scannedTime = getScannedTime(new Date(timestamp), dateLocale);
  const formatDate = formatExposedDate(new Date(timestamp), dateLocale);

  const ScannedDate = () => {
    return (
      <>
        {dateLocale === 'en-CA' ? (
          <Text accessibilityLabel={`${scannedTime} on ${readableDate}`}>
            <Text>{scannedTime} on </Text>

            <Text>{formatDate}</Text>
          </Text>
        ) : (
          <Text accessibilityLabel={`Le ${readableDate} à ${scannedTime}`}>
            <Text>Le {formatDate} à </Text>

            <Text>{scannedTime}</Text>
          </Text>
        )}
      </>
    );
  };

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Header />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m" paddingTop="m">
            <Icon name="check-in-successful" height={65} width={65} />
          </Box>
          <Box paddingHorizontal="m">
            <Box paddingBottom="l">
              <Text variant="bodyTitle" marginTop="xl" accessibilityRole="header" accessibilityAutoFocus>
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
              <Box backgroundColor="gray5" padding="m" style={styles.boxStyle}>
                <Text fontWeight="bold" marginBottom="s">
                  {name}
                </Text>
                <Text marginBottom="s">{address}</Text>
                <Box>
                  <ScannedDate />
                </Box>
              </Box>
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
  boxStyle: {
    borderRadius: 10,
  },
});
