import {Linking, NativeModules, Platform} from 'react-native';
import Share from 'react-native-share';
import {useEffect, useState} from 'react';

export type ShareablePlatform = 'instagram' | 'messages';

const RNShare = NativeModules.RNShare;

const queries = Platform.select({
  ios: {
    instagram: 'instagram://',
  },
  android: {
    instagram: 'com.instagram.android',
    messages: 'com.google.android.apps.messaging',
  },
});

const isAvailableiOS = async (platform: ShareablePlatform) => {
  try {
    if (platform === 'messages') {
      const capabilities = await RNShare.messagesSendingCapabilities();
      return capabilities.text && capabilities.attachment;
    }

    const target: string | undefined = queries![platform];
    return await Linking.canOpenURL(target!);
  } catch (error) {
    return false;
  }
};

const isAvailableAndroid = async (platform: ShareablePlatform) => {
  try {
    const target: string | undefined = queries![platform];
    const status = await Share.isPackageInstalled(target!);
    return (status as {isInstalled: boolean; message: string}).isInstalled;
  } catch (error) {
    return false;
  }
};

const isAvailable = async (platform: ShareablePlatform) => {
  if (Platform.OS === 'ios') {
    return isAvailableiOS(platform);
  } else {
    return isAvailableAndroid(platform);
  }
};

/**
 * Determines and subsequently returns which of the platforms
 * as defined by `Device.ShareablePlatform` are installed on
 * the user's device.
 *
 * @returns the array of installed ShareablePlatforms, if any exist;
 *          otherwise an empty array
 */

export const useShareablePlatforms = () => {
  const [shareablePlatforms, setShareablePlatforms] = useState<ShareablePlatform[]>([]);

  useEffect(() => {
    const loadShareablePlatforms = async () => {
      const platforms: ShareablePlatform[] = ['messages', 'instagram'];

      try {
        const availablePlatforms = await Promise.all(platforms.map(isAvailable));
        const available: ShareablePlatform[] = [];

        availablePlatforms.forEach((isAvailable, index) => {
          if (isAvailable) available.push(platforms[index]);
        });

        setShareablePlatforms(available);
      } catch (error) {
        console.log('>>> useShareablePlatform: ', error);
      }
    };
    loadShareablePlatforms();
  }, []);

  return shareablePlatforms;
};

const shareToSingleApp = async (shareOptions: any) => {
  try {
    await Share.shareSingle(shareOptions);
  } catch (error) {
    console.log('>>> error sharing to single app:', error);
  }
};

export const shareContent = async (message: string | undefined) => {
  const options = {
    failOnCancel: false,
    message,
  };

  try {
    await Share.open(options);
  } catch (error) {
    console.log('>>> error sharing content:', error);
  }
};

export const shareMessages = async (message: string | undefined) => {
  const options = {
    social: Platform.select({ios: 'messages', android: 'sms'}),
    message,
  };

  try {
    await shareToSingleApp(options);
  } catch (error) {
    console.log('>>> error sharing messages:', error);
  }
};

export const shareInstagramStory = async (backgroundColoriOS: string, messageOrUrl: string) => {
  const platformOptions = Platform.select({
    ios: {
      social: Share.Social.INSTAGRAM_STORIES,
      method: Share.InstagramStories.SHARE_STICKER_IMAGE,
      stickerImage: messageOrUrl,
      backgroundBottomColor: backgroundColoriOS,
      backgroundTopColor: backgroundColoriOS,
    },
    android: {
      social: Share.Social.INSTAGRAM,
      url: messageOrUrl,
      forceDialog: true,
    },
  });

  const options = {
    failOnCancel: false,
    ...platformOptions,
  };

  shareToSingleApp(options);
};
