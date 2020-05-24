import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ShareablePlatform, shareContent, shareInstagramStory, shareMessages, useShareablePlatforms} from 'bridge/Share';
import {Box, Icon, Text, Toolbar} from 'components';
import {Image, StyleSheet, TouchableOpacity, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import theme from 'shared/theme';
import {useI18n} from '@shopify/react-i18n';
import OnboardingBg from 'assets/onboarding-bg.svg';

const PlatformIcon = ({platform}: {platform: ShareablePlatform}) => {
  switch (platform) {
    case 'instagram':
      return <Image style={styles.icon} source={require('assets/instagram.png')} />;
    case 'messages':
      return <Image style={styles.icon} source={require('assets/messages.png')} />;
    default:
      return null;
  }
};

export const SharingScreen = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  const platforms = useShareablePlatforms();
  const share = useCallback(
    (platform: ShareablePlatform) => {
      switch (platform) {
        case 'instagram': {
          shareInstagramStory(theme.colors.mainBackground);
          break;
        }
        case 'messages': {
          shareMessages(i18n.translate('Sharing.Message'));
        }
      }
    },
    [i18n],
  );
  const shareMore = useCallback(() => {
    shareContent(i18n.translate('Sharing.Message'));
  }, [i18n]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title={i18n.translate('Sharing.Title')}
          navIcon="icon-back-arrow"
          navText={i18n.translate('Sharing.Close')}
          navLabel={i18n.translate('Sharing.Close')}
          onIconClicked={close}
        />
        <ScrollView>
          <Box width="100%">
            <OnboardingBg width="100%" viewBox="0 0 375 325" />
          </Box>
          <Box paddingHorizontal="m" marginBottom="l">
            <Text variant="bodyText" fontSize={16} color="overlayBodyText">
              {i18n.translate('Sharing.SubTitle')}
            </Text>
          </Box>

          <Box paddingHorizontal="m">
            <Box paddingHorizontal="s" paddingRight="m" borderRadius={10} backgroundColor="infoBlockNeutralBackground">
              {platforms.map(platform => (
                <React.Fragment key={platform}>
                  <TouchableOpacity onPress={() => share(platform)}>
                    <Box paddingVertical="s" flexDirection="row" alignItems="center" justifyContent="space-between">
                      <PlatformIcon platform={platform} />
                      <Text variant="bodyText" marginVertical="s" marginLeft="s" color="overlayBodyText">
                        {i18n.translate(`Sharing.Platform-${platform}`)}
                      </Text>
                      <Box flex={1} alignItems="flex-end">
                        <Icon size={32} name="icon-chevron" />
                      </Box>
                    </Box>
                  </TouchableOpacity>
                  <Box height={1} marginHorizontal="-m" backgroundColor="overlayBackground" />
                </React.Fragment>
              ))}
              <TouchableOpacity onPress={() => shareMore()}>
                <Box paddingVertical="s" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <View style={styles.moreIcon}>
                    <Icon size={16} name="icon-ellipsis" />
                  </View>
                  <Text variant="bodyText" marginVertical="s" marginLeft="s" color="overlayBodyText">
                    {i18n.translate('Sharing.More')}
                  </Text>
                  <Box flex={1} alignItems="flex-end">
                    <Icon size={32} name="icon-chevron" />
                  </Box>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  icon: {
    height: 30,
    width: 30,
  },
  moreIcon: {
    height: 30,
    width: 30,
    borderRadius: 7,
    backgroundColor: 'rgba(196, 196, 196, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
