import React, {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ShareablePlatform, shareContent, shareInstagramStory, shareMessages, useShareablePlatforms} from 'bridge/Share';
import {Box, Icon, Text, Toolbar} from 'components';
import {Image, StyleSheet, TouchableOpacity, View, Platform, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Theme} from 'shared/theme';
import {useI18n} from '@shopify/react-i18n';
import OnboardingBg from 'assets/onboarding-bg.svg';
import {useTheme} from '@shopify/restyle';

const ICONS = {
  instagram: Platform.select({
    android: require('assets/instagram.android.png'),
    ios: require('assets/instagram.ios.png'),
  }),
  messages: Platform.select({
    android: require('assets/messages.android.png'),
    ios: require('assets/messages.ios.png'),
  }),
};

export const SharingScreen = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const theme = useTheme<Theme>();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  const platforms = useShareablePlatforms();
  const onShareByPlatform = useMemo(() => {
    return platforms.reduce(
      (acc, platform) => ({
        ...acc,
        [platform]: () => {
          switch (platform) {
            case 'instagram': {
              shareInstagramStory(
                theme.colors.mainBackground,
                Platform.select({
                  android: i18n.translate('Sharing.Message'),
                  ios: i18n.translate('Sharing.InstagramImageUrl'),
                })!,
              );
              break;
            }
            case 'messages': {
              shareMessages(i18n.translate('Sharing.Message'));
              break;
            }
          }
        },
      }),
      {} as {[key in ShareablePlatform]: () => void},
    );
  }, [i18n, platforms, theme.colors.mainBackground]);
  const onShareMore = useCallback(() => {
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
        <Box flex={1}>
          <ScrollView>
            <Box>
              <OnboardingBg width="100%" viewBox="0 0 375 325" />
            </Box>
            <Box paddingHorizontal="m">
              <Text variant="bodyText" fontSize={16} color="overlayBodyText">
                {i18n.translate('Sharing.SubTitle')}
              </Text>
            </Box>
            <Box padding="m">
              <Box
                paddingHorizontal="s"
                paddingRight="m"
                borderRadius={10}
                backgroundColor="infoBlockNeutralBackground"
              >
                {platforms.map(platform => (
                  <React.Fragment key={platform}>
                    <TouchableOpacity onPress={onShareByPlatform[platform]} accessibilityRole="button">
                      <Box paddingVertical="s" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Image style={styles.icon} source={ICONS[platform]} />
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
                <TouchableOpacity onPress={onShareMore} accessibilityRole="button">
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
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  icon: {
    height: 30,
    width: 30,
  },

  moreIcon: {
    height: 30,
    width: 30,
    borderRadius: Platform.select({android: 0, ios: 7}),
    backgroundColor: 'rgba(196, 196, 196, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
