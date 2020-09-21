import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Box, Text, InfoShareItem} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {captureException} from 'shared/log';
import {ExposedHelpButton} from 'components/ExposedHelpButton';

export const InfoShareView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);
  const onGetCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  const onLanguage = useCallback(() => navigation.navigate('LanguageSelect'), [navigation]);
  const onRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);
  const onHelp = useCallback(() => {
    Linking.openURL(i18n.translate('Info.HelpUrl')).catch(error => captureException('An error occurred', error));
  }, [i18n]);

  return (
    <>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="m">
        <InfoShareItem
          testID="getCodeButton"
          onPress={onGetCode}
          text={i18n.translate('Info.GetCode')}
          icon="icon-chevron"
        />
        <ExposedHelpButton inMenu />
        <InfoShareItem
          onPress={onHelp}
          text={i18n.translate('Info.Help')}
          icon="icon-external-arrow"
          accessibilityRole="link"
          accessibilityHint={`${i18n.translate('Info.Help')} . ${i18n.translate('Home.ExternalLinkHint')}`}
        />
      </Box>
      <Box marginTop="l" marginBottom="m">
        <Text variant="settingTitle" fontWeight="normal">
          {i18n.translate('Info.SettingsTitle')}
        </Text>
      </Box>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="m">
        <InfoShareItem
          onPress={onRegion}
          text={i18n.translate('Info.ChangeRegion')}
          icon="icon-chevron"
          testID="changeRegion"
        />
        <InfoShareItem onPress={onLanguage} text={i18n.translate('Info.ChangeLanguage')} icon="icon-chevron" lastItem />
      </Box>
      <Box marginTop="l" marginBottom="m">
        <Text variant="settingTitle" fontWeight="normal">
          {i18n.translate('Info.InformationTitle')}
        </Text>
      </Box>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="l">
        <InfoShareItem onPress={onLearnMore} text={i18n.translate('Info.LearnMore')} icon="icon-chevron" />
        <InfoShareItem onPress={onPrivacy} text={i18n.translate('Info.Privacy')} icon="icon-chevron" lastItem />
      </Box>
    </>
  );
};
