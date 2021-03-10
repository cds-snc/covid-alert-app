import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Text, ButtonSingleLine, RoundedBox} from 'components';
import {DefaultFutureStorageService, StorageDirectory} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const DiagnosedShareUploadView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(async () => {
    const initialTekUploadComplete = await DefaultFutureStorageService.sharedInstance().retrieve(
      StorageDirectory.GlobalInitialTekUploadCompleteKey,
    );
    const screen = initialTekUploadComplete === 'false' ? 'IntermediateScreen' : 'TekUploadSubsequentDays';
    return navigation.navigate('DataSharing', {screen});
  }, [navigation]);

  return (
    <BaseHomeView iconName="hand-reminder-red">
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate('Home.DiagnosedShareUploadView.Title')}</HomeScreenTitle>
        <Text variant="bodyText" color="bodyText" marginBottom="m">
          {i18n.translate('Home.DiagnosedShareUploadView.Body1')}
        </Text>
        <ButtonSingleLine
          text={i18n.translate('Home.DiagnosedShareUploadView.ButtonCTA')}
          variant="dangerWhiteText"
          onPress={toDataShare}
          iconName="icon-chevron-white"
        />
      </RoundedBox>
    </BaseHomeView>
  );
};
