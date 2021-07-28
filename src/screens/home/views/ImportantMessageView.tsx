import React from 'react';
import {useI18n, useRegionalI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';
import {useCachedStorage} from 'services/StorageService';

import {HomeScreenTitle} from '../components/HomeScreenTitle';
import {BaseHomeView} from '../components/BaseHomeView';

export const ImportantMessageView = () => {
  const i18n = useI18n();
  const regionalI18n = useRegionalI18n();

  const onPress = () => {
    Linking.openURL(regionalI18n.translate('RegionContent.ImportantMessage.LearnMoreUrl')).catch(error =>
      captureException('An error occurred', error),
    );
  };

  const {setLocale} = useCachedStorage();

  const toggleLanguageOnPress = () => {
    switch (i18n.locale) {
      case 'fr':
        setLocale('en');
        break;
      default:
        setLocale('fr');
    }
  };

  return (
    <BaseHomeView>
      <HomeScreenTitle>{regionalI18n.translate('RegionContent.ImportantMessage.Title')}</HomeScreenTitle>
      <Text variant="bodyText" color="bodyText">
        {regionalI18n.translate('RegionContent.ImportantMessage.Body')}
      </Text>
      <Box alignSelf="stretch" marginBottom="l" marginTop="l">
        <ButtonSingleLine
          text={regionalI18n.translate('RegionContent.ImportantMessage.CTA')}
          variant="bigFlatBlue"
          iconName="icon-external-arrow-light"
          onPress={onPress}
        />
      </Box>
      <Box alignSelf="stretch" marginBottom="l" marginTop="l">
        <ButtonSingleLine
          text={regionalI18n.translate('RegionContent.ImportantMessage.ChangeLanguage')}
          variant="plain"
          onPress={toggleLanguageOnPress}
        />
      </Box>
    </BaseHomeView>
  );
};
