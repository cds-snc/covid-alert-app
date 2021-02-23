import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {BottomSheetBehavior, Box, Text} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n, useRegionalI18n} from 'locale';
import {captureException} from 'shared/log';
import {useStorage} from 'services/StorageService';
import {getExposedHelpMenuURL} from 'shared/RegionLogic';
import {APP_VERSION_NAME, APP_VERSION_CODE} from 'env';
import {getLogUUID} from 'shared/logging/uuid';

import {OnOffButton} from '../components/OnOffButton';
import {InfoShareItem} from '../components/InfoShareItem';

export const InfoShareView = ({bottomSheetBehavior}: {bottomSheetBehavior: BottomSheetBehavior}) => {
  const i18n = useI18n();
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();
  const navigation = useNavigation();

  const onPrivacy = useCallback(() => {
    Linking.openURL(i18n.translate('Info.PrivacyUrl')).catch(error => captureException('An error occurred', error));
  }, [i18n]);

  const onGetCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  const onLanguage = useCallback(() => navigation.navigate('LanguageSelect'), [navigation]);
  const onRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);
  const onHelp = useCallback(() => {
    Linking.openURL(i18n.translate('Info.HelpUrl')).catch(error => captureException('An error occurred', error));
  }, [i18n]);

  const regionIcon = region !== undefined && region !== 'None' ? 'icon-external-arrow' : 'icon-chevron';

  const onExposedHelp = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      Linking.openURL(getExposedHelpMenuURL(region, regionalI18n)).catch(error =>
        captureException('An error occurred', error),
      );
    } else {
      navigation.navigate('RegionSelectExposedNoPT', {drawerMenu: true});
    }
  }, [navigation, region, regionalI18n]);

  const versionNumber = `${i18n.translate('OverlayOpen.Version')}: ${APP_VERSION_NAME} (${APP_VERSION_CODE})`;

  return (
    <>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="m" testID="InfoShareViewID">
        <InfoShareItem
          testID="getCodeButton"
          onPress={onGetCode}
          text={i18n.translate('Info.GetCode')}
          icon="icon-chevron"
        />

        <InfoShareItem
          onPress={onExposedHelp}
          text={i18n.translate('Home.ExposedHelpCTA')}
          icon={regionIcon}
          accessibilityRole="link"
          accessibilityHint={`${i18n.translate('Home.ExposedHelpCTA')} . ${i18n.translate('Home.ExternalLinkHint')}`}
        />

        <InfoShareItem
          onPress={onHelp}
          text={i18n.translate('Info.Help')}
          icon="icon-external-arrow"
          accessibilityRole="link"
          accessibilityHint={`${i18n.translate('Info.Help')} . ${i18n.translate('Home.ExternalLinkHint')}`}
          lastItem
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
        <InfoShareItem onPress={onLanguage} text={i18n.translate('Info.ChangeLanguage')} icon="icon-chevron" />
        <OnOffButton bottomSheetBehavior={bottomSheetBehavior} />
      </Box>
      <Box marginTop="l" marginBottom="m">
        <Text variant="settingTitle" fontWeight="normal">
          {i18n.translate('Info.InformationTitle')}
        </Text>
      </Box>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="l">
        <InfoShareItem onPress={onLearnMore} text={i18n.translate('Info.LearnMore')} icon="icon-chevron" />
        <InfoShareItem
          icon="icon-external-arrow"
          accessibilityRole="link"
          onPress={onPrivacy}
          accessibilityHint={`${i18n.translate('Info.Privacy')} . ${i18n.translate('Home.ExternalLinkHint')}`}
          text={i18n.translate('Info.Privacy')}
          lastItem
        />
      </Box>
      <Box paddingBottom="l">
        <Text variant="smallText">
          {versionNumber} {getLogUUID()}
        </Text>
      </Box>
    </>
  );
};
