import {
  PlatformAndroidStatic,
  PlatformIOSStatic,
  PlatformMacOSStatic,
  PlatformWebStatic,
  PlatformWindowsOSStatic,
} from 'react-native';

export const doesPlatformSupportV2 = (
  Platform:
    | PlatformIOSStatic
    | PlatformAndroidStatic
    | PlatformWindowsOSStatic
    | PlatformMacOSStatic
    | PlatformWebStatic,
) => {
  if (Platform.OS === 'android') {
    return true;
  }
  if (Platform.OS !== 'ios') {
    return false;
  }
  let numericVersion: number;
  if (typeof Platform.Version === 'string') {
    const majorMinorVersion = Platform.Version.split('.').slice(0, 2).join('.');
    numericVersion = Number(majorMinorVersion);
  } else {
    numericVersion = Platform.Version;
  }
  if (numericVersion === 12.5 || numericVersion >= 13.7) {
    return true;
  }
  return false;
};
