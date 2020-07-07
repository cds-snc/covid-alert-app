import React, {useCallback} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

interface InfoShareItemProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  icon: IconProps['name'];
  lastItem: boolean;
}
const InfoShareItem = ({onPress, text, icon, lastItem, ...touchableProps}: InfoShareItemProps) => (
  <>
    <TouchableOpacity onPress={onPress} accessibilityRole="button" {...touchableProps}>
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
        <Text variant="bodyText" marginVertical="s" color="overlayBodyText">
          {text}
        </Text>
        <Box alignSelf="center">
          <Icon size={25} name={icon} />
        </Box>
      </Box>
    </TouchableOpacity>
    {!lastItem && <Box height={5} marginHorizontal="-m" backgroundColor="overlayBackground" />}
  </>
);

export const InfoShareView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);
  const onGetCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  const onLanguage = useCallback(() => navigation.navigate('LanguageSelect'), [navigation]);
  const onRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);

  return (
    <>
      <Box marginTop="l" marginBottom="m">
        <Text variant="overlayTitle">{i18n.translate('Info.SettingsTitle')}</Text>
      </Box>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="m">
        <InfoShareItem
          onPress={onRegion}
          text={i18n.translate('Info.ChangeRegion')}
          icon="icon-chevron"
          lastItem={false}
        />
        <InfoShareItem onPress={onLanguage} text={i18n.translate('Info.ChangeLanguage')} icon="icon-chevron" lastItem />
      </Box>
      <Box marginTop="l" marginBottom="m">
        <Text variant="overlayTitle">{i18n.translate('Info.InformationTitle')}</Text>
      </Box>
      <Box paddingHorizontal="m" borderRadius={10} overflow="hidden" marginBottom="l">
        <InfoShareItem lastItem={false} onPress={onGetCode} text={i18n.translate('Info.GetCode')} icon="icon-chevron" />
        <InfoShareItem
          lastItem={false}
          onPress={onLearnMore}
          text={i18n.translate('Info.LearnMore')}
          icon="icon-chevron"
        />
        <InfoShareItem onPress={onPrivacy} text={i18n.translate('Info.Privacy')} icon="icon-chevron" lastItem />
      </Box>
    </>
  );
};
