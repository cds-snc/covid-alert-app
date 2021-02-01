import React, {useCallback} from 'react';
import {Box, Button, Text, Icon, InfoBlock} from 'components';
import {useStorage} from 'services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {useI18n} from 'locale';
import {getCurrentDate} from 'shared/date-fns';

export const CheckInSuccessfulScreen = ({route}: any) => {
  const {name} = route.params;
  const {checkInIDJson, setRemoveCheckIn} = useStorage();
  const i18n = useI18n();
  const navigation = useNavigation();
  const navigateHome = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Box paddingBottom="l">
          <Icon name="icon-green-check" height={50} width={60} />
          <Text variant="bodySubTitle" marginTop="xl">
            {i18n.translate('QRCheckInView.Title')}
          </Text>
        </Box>
        <Box paddingBottom="l">
          <InfoBlock
            titleBolded={urlToString(name)}
            backgroundColor="greenBackground"
            color="bodyText"
            button={{
              text: '',
              action: () => {},
            }}
            text={returnTodaysDate()}
            showButton={false}
          />
        </Box>
      </Box>
      <Box marginTop="l" padding="m">
        <Button variant="thinFlat" text={i18n.translate('QRCheckInView.CTA1')} onPress={navigateHome} />
      </Box>
      <Box margin="m">
        <Button
          variant="thinFlat"
          text={i18n.translate('QRCheckInView.CTA2')}
          onPress={() => setRemoveCheckIn(checkInIDJson)}
        />
      </Box>
    </BaseDataSharingView>
  );
};

function urlToString(url: string): string {
  const title = url.replace(/_/g, ' ');
  return title;
}

const returnTodaysDate = (): string => {
  const today = getCurrentDate();
  const dateString = today.toLocaleString('default', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return dateString;
};
