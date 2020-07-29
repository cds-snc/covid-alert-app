# End to end testing with Detox

## iOS setup instructions

1. Copy code from readme into info.plist to get the ios simulator working ([instructions](https://github.com/cds-snc/covid-alert-app#ios-local-development)).
2. `yarn install`, `sudo gem install cocoapods`, `bundle install && yarn pod-install`
3. `brew tap wix/brew && brew install applesimutils`
4. `yarn pre:test:ios`
5. `yarn test:ios`

## Android setup instructions

1. Install the android emulator `Pixel_3_API_29` using [these instructions](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#installing-from-android-studio).
2. [Set up quick boot](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#emulator-quick-boot) on the emulator.
3. `yarn pre:test:android`
4. `yarn test:android`

## Notes

We may want to look at using Android Open-Source Project (AOSP) emulators, since [Detox says they are better for automated testing](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#android-aosp-emulators).
