import React, {useCallback} from 'react';
import {useI18n, useRegionalI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, Text} from 'components';
import {Linking, ScrollView, StyleSheet} from 'react-native';
import {StatusHeaderView} from 'screens/menu/views/StatusHeaderView';
import {useSystemStatus, SystemStatus} from 'services/ExposureNotificationService';
import {APP_VERSION_NAME, APP_VERSION_CODE} from 'env';
import {useCachedStorage} from 'services/StorageService';
import {getExposedHelpMenuURL} from 'shared/RegionLogic';
import {captureException} from 'shared/log';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {ConditionalMenuPanels} from './views/ConditionalMenuPanels';
import {PrimaryMenuButtons} from './views/PrimaryMenuButtons';
import {InfoShareItem} from './components/InfoShareItem';
import {CloseButton} from './components/CloseButton';

export const MenuScreen = () => {
  const [systemStatus] = useSystemStatus();
  const navigation = useNavigation();
  const i18n = useI18n();
  const {region} = useCachedStorage();
  const regionalI18n = useRegionalI18n();

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
  const autoFocusRef = useAccessibilityAutoFocus(true);

  return (
    <SafeAreaView style={styles.flex}>
      <Box backgroundColor="overlayBackground" paddingHorizontal="m" flex={1}>
        <Box flexDirection="row">
          <Box flex={1} style={styles.title} paddingRight="m">
            <Text paddingVertical="m" focusRef={autoFocusRef}>
              <StatusHeaderView enabled={systemStatus === SystemStatus.Active} />
            </Text>
          </Box>
          <Box marginVertical="m">
            <CloseButton />
          </Box>
        </Box>
        <ScrollView style={styles.flex}>
          <Box marginBottom="m">
            <PrimaryMenuButtons />
          </Box>

          <Box marginBottom="m">
            <ConditionalMenuPanels />
          </Box>

          <Box marginBottom="m" testID="InfoShareViewID">
            <InfoShareItem
              text={i18n.translate('Info.GetCode')}
              testID="getCodeButton"
              onPress={onGetCode}
              icon="icon-chevron"
            />

            <InfoShareItem
              text={i18n.translate('Home.ExposedHelpCTA')}
              onPress={onExposedHelp}
              icon={regionIcon}
              accessibilityRole="link"
              accessibilityHint={`${i18n.translate('Home.ExposedHelpCTA')} . ${i18n.translate(
                'Home.ExternalLinkHint',
              )}`}
            />

            <InfoShareItem
              text={i18n.translate('Info.Help')}
              onPress={onHelp}
              icon="icon-external-arrow"
              accessibilityRole="link"
              accessibilityHint={`${i18n.translate('Info.Help')} . ${i18n.translate('Home.ExternalLinkHint')}`}
            />
          </Box>

          <Box marginTop="m" marginBottom="s">
            <Text variant="settingTitle" fontWeight="normal">
              {i18n.translate('Info.SettingsTitle')}
            </Text>
          </Box>
          <Box marginBottom="m">
            <InfoShareItem
              text={i18n.translate('Info.ChangeRegion')}
              onPress={onRegion}
              icon="icon-chevron"
              testID="changeRegion"
            />
            <InfoShareItem text={i18n.translate('Info.ChangeLanguage')} onPress={onLanguage} icon="icon-chevron" />
          </Box>

          <Box marginTop="m" marginBottom="s">
            <Text variant="settingTitle" fontWeight="normal">
              {i18n.translate('Info.InformationTitle')}
            </Text>
          </Box>
          <Box marginBottom="l">
            <InfoShareItem text={i18n.translate('Info.LearnMore')} onPress={onLearnMore} icon="icon-chevron" />
            <InfoShareItem
              text={i18n.translate('Info.Privacy')}
              icon="icon-external-arrow"
              accessibilityRole="link"
              onPress={onPrivacy}
              accessibilityHint={`${i18n.translate('Info.Privacy')} . ${i18n.translate('Home.ExternalLinkHint')}`}
            />
          </Box>
          <Box paddingBottom="l">
            <Text variant="smallText">{versionNumber}</Text>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  title: {
    justifyContent: 'center',
  },
});
