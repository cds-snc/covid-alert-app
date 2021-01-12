# End to end testing with Detox

## iOS

### Initial setup

1. Follow install instructions for main repo
2. `brew tap wix/brew && brew install applesimutils`

### Running the tests

1. `yarn pre:test:ios`
2. `yarn test:ios`

## Android

### Initial setup

1. Get yourself one or more emulators, you have a couple options:

- [Detox recommends Android Open-Source Project (AOSP) emulators](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#android-aosp-emulators)
- Install from Android Studio [these instructions](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#installing-from-android-studio)

2. (Optional) [Set up quick boot](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#emulator-quick-boot) on the emulator.

**NOTE**: The AOSP emulators appear to require Java 8. You may have a newer version of Java like Java 14 installed. Here are some instructions on [how to install older versions of Java and switch them](java.md)

### Running the tests

1. `yarn pre:test:android`
2. `yarn test:android`

## Troubleshooting

Error:

```bash
> Task :@react-native-community_async-storage:processDebugAndroidTestResources FAILED
```

Try: `cd android && ./gradlew clean`
