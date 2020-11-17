import React, {useCallback} from 'react';
import {Linking, TouchableOpacity, TouchableOpacityProps, Alert} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n, useRegionalI18n} from 'locale';
import {captureException} from 'shared/log';
import {useStorage} from 'services/StorageService';
import {getExposedHelpMenuURL} from 'shared/RegionLogic';
import {
  SystemStatus,
  useStopExposureNotificationService,
  useStartExposureNotificationService,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import NativePushNotification from 'bridge/PushNotification';

interface InfoShareItemProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  icon: IconProps['name'];
  lastItem?: boolean;
}
const InfoShareItem = ({onPress, text, icon, lastItem, ...touchableProps}: InfoShareItemProps) => (
  <>
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} accessibilityRole="button" {...touchableProps}>
      <Box
        paddingVertical="s"
        marginHorizontal="-m"
        paddingHorizontal="m"
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
        backgroundColor="infoBlockNeutralBackground"
        borderRadius={5}
      >
        <Box flex={1}>
          <Text variant="bodyText" marginVertical="s" color="overlayBodyText">
            {text}
          </Text>
        </Box>

        <Box alignSelf="center">
          <Icon size={25} name={icon} />
        </Box>
      </Box>
    </TouchableOpacity>
    {!lastItem && <Box height={5} marginHorizontal="-m" backgroundColor="overlayBackground" />}
  </>
);

export const InfoShareView = () => {
  const i18n = useI18n();
  const {region, setUserStopped} = useStorage();
  const regionalI18n = useRegionalI18n();
  const navigation = useNavigation();
  const startExposureNotificationService = useStartExposureNotificationService();
  const stopExposureNotificationService = useStopExposureNotificationService();

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
  const onExposedHelp = useCallback(() => {
    Linking.openURL(getExposedHelpMenuURL(region, regionalI18n)).catch(error =>
      captureException('An error occurred', error),
    );
  }, [region, regionalI18n]);

  const onStop = useCallback(() => {
    Alert.alert(
      i18n.translate('Info.ToggleCovidAlert.Confirm.Title'),
      i18n.translate('Info.ToggleCovidAlert.Confirm.Body'),
      [
        {
          text: i18n.translate('Info.ToggleCovidAlert.Confirm.Cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: i18n.translate('Info.ToggleCovidAlert.Confirm.Accept'),
          onPress: () => {
            stopExposureNotificationService();
            setUserStopped(true);
            NativePushNotification.presentLocalNotification({
              alertTitle: i18n.translate('Notification.PausedMessageTitle'),
              alertBody: i18n.translate('Notification.PausedMessageBody'),
            });
          },
          style: 'default',
        },
      ],
    );
  }, [i18n, setUserStopped, stopExposureNotificationService]);

  const onStart = useCallback(() => {
    startExposureNotificationService();
    setUserStopped(false);
  }, [setUserStopped, startExposureNotificationService]);

  const [systemStatus] = useSystemStatus();

  return (
    <>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginTop="m" marginBottom="m">
        <InfoShareItem
          testID="getCodeButton"
          onPress={onGetCode}
          text={i18n.translate('Info.GetCode')}
          icon="icon-chevron"
        />
        <InfoShareItem
          onPress={onExposedHelp}
          text={i18n.translate('Home.ExposedHelpCTA')}
          icon="icon-external-arrow"
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
        {systemStatus === SystemStatus.Active ? (
          <InfoShareItem
            onPress={onStop}
            text={i18n.translate('Info.ToggleCovidAlert.TurnOff')}
            icon="icon-chevron"
            lastItem
          />
        ) : (
          <InfoShareItem
            onPress={onStart}
            text={i18n.translate('Info.ToggleCovidAlert.TurnOn')}
            icon="icon-chevron"
            lastItem
          />
        )}
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
    </>
  );
};
