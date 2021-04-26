import {PlatformAndroidStatic, PlatformIOSStatic} from 'react-native';

import {doesPlatformSupportV2} from '../ExposureNotificationServiceUtils';

describe('ExposureNotificationServiceUtils', () => {
  describe('doesPlatformSupportV2', () => {
    it('all android versions are supported', () => {
      const platform: PlatformAndroidStatic = {
        OS: 'android',
        isTV: false,
        Version: 9,
        select: jest.fn(),
      };
      expect(doesPlatformSupportV2(platform)).toStrictEqual(true);
    });

    it.each([
      ['13.6', false],
      ['13.7', true],
      ['12.5', true],
      ['12.5.1', true],
      ['12.5.0.1', true],
      ['1.1', false],
      ['12.4', false],
      ['14.4', true],
      [14.4, true],
    ])('if iOS version is %p, doesPlatformSupportV2 returns %p', (version, isSupported) => {
      const platform: PlatformIOSStatic = {
        OS: 'ios',
        isPad: false,
        isTVOS: false,
        isTV: false,
        Version: version,
        select: jest.fn(),
      };
      expect(doesPlatformSupportV2(platform)).toStrictEqual(isSupported);
    });
  });
});
