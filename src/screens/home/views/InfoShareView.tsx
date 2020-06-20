import React, {useCallback, useContext} from 'react';
import {TouchableOpacity, TouchableOpacityProps, Linking} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

import {BottomSheetClose} from '../../../shared/bottomSheetClose';

interface InfoShareItemProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  icon: IconProps['name'];
}
const InfoShareItem = ({onPress, text, icon, ...touchableProps}: InfoShareItemProps) => (
  <>
    <TouchableOpacity onPress={onPress} accessibilityRole="button" {...touchableProps}>
      <Box paddingVertical="s" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Text variant="bodyText" marginVertical="s" color="overlayBodyText">
          {text}
        </Text>
        <Box alignSelf="center">
          <Icon size={32} name={icon} />
        </Box>
      </Box>
    </TouchableOpacity>
    <Box height={1} marginHorizontal="-m" backgroundColor="overlayBackground" />
  </>
);

export const InfoShareView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const BottomSheetCloseFn = useContext(BottomSheetClose);

  const onSymptomps = useCallback(() => {
    Linking.openURL(i18n.translate('Info.SymptomsUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  // const onShare = useCallback(() => navigation.navigate('Sharing'), [navigation]);
  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  const onLanguage = useCallback(() => navigation.navigate('LanguageSelect'), [navigation]);
  const onRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);
  const onToggle = useCallback(() => {
    BottomSheetCloseFn();
  }, [BottomSheetCloseFn]);

  return (
    <>
      <Box paddingHorizontal="m" borderRadius={10} backgroundColor="infoBlockNeutralBackground">
        <InfoShareItem
          onPress={onSymptomps}
          text={i18n.translate('Info.CheckSymptoms')}
          icon="icon-external-arrow"
          accessibilityLabel={i18n.translate('Info.CheckSymptoms')}
          accessibilityRole="link"
          accessibilityHint={i18n.translate('Home.ExternalLinkHint')}
        />
        {/* <InfoShareItem onPress={onShare} text={i18n.translate('Info.TellAFriend')} icon="icon-share" /> */}
        <InfoShareItem onPress={onLearnMore} text={i18n.translate('Info.LearnMore')} icon="icon-chevron" />
      </Box>
      <Box paddingHorizontal="m" borderRadius={10} backgroundColor="infoBlockNeutralBackground" marginTop="m">
        <InfoShareItem onPress={onLanguage} text={i18n.translate('Info.ChangeLanguage')} icon="icon-chevron" />
        <InfoShareItem onPress={onRegion} text={i18n.translate('Info.ChangeRegion')} icon="icon-chevron" />
        <InfoShareItem onPress={onPrivacy} text={i18n.translate('Info.Privacy')} icon="icon-chevron" />
        <InfoShareItem onPress={onToggle} text={i18n.translate('Togglestuff')} icon="icon-chevron" />
      </Box>
    </>
  );
};
