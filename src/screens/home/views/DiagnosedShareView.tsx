import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {Text, ButtonSingleLine, Box, RoundedBox} from 'components';
import {DefaultFutureStorageService, StorageDirectory} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const DiagnosedShareView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(async () => {
    const initialTekUploadComplete = await DefaultFutureStorageService.sharedInstance().retrieve(
      StorageDirectory.GlobalInitialTekUploadCompleteKey,
    );
    const screen = initialTekUploadComplete === 'false' ? 'Step2' : 'TekUploadSubsequentDays';
    return navigation.navigate('DataSharing', {screen});
  }, [navigation]);
  return (
    <BaseHomeView iconName="hand-reminder" testID="diagnosedShare">
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate('Home.DiagnosedShareView.Title')}</HomeScreenTitle>
        <Text variant="bodyText" color="bodyText" marginBottom="m">
          {i18n.translate('Home.DiagnosedShareView.Body1')}
        </Text>
        <Text variant="bodyText" testID="bodyText" color="bodyText">
          <Text fontWeight="bold">{i18n.translate('Home.DiagnosedShareView.Body2')}</Text>
          {i18n.translate('Home.DiagnosedShareView.Body3')}
        </Text>
        <Box alignSelf="stretch" marginTop="l" marginBottom="m">
          <ButtonSingleLine
            text={i18n.translate('Home.DiagnosedShareView.ButtonCTA')}
            variant="bigFlatBlue"
            onPress={toDataShare}
            iconName="icon-chevron-white"
          />
        </Box>
      </RoundedBox>
    </BaseHomeView>
  );
};
