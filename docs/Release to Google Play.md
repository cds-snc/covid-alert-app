# Release to Google Play

## Manual Build

These instructions follow steps from the [React Native docs](https://reactnative.dev/docs/signed-apk-android.html), but adds in things specific to the CovidShield codebase.

### What you'll need

- Keystore file
- Store password
- Key password
- Key alias

### Place the keystore file

Copy your keystore file into `android/app`. Take note of the full path to where you copied it to, including the file name.

### Configure production settings

First, you'll need to create a `.env.production` file at the base of your repository. You can copy the `.env` file in the base of the repository to get started. Add in the appropriate information, and uncomment the block around creating an Android release.

```
# For Release Builds to Google Play
# PRODUCT_BUNDLE_IDENTIFIER=<product bundle identifier>
# COVIDSHIELD_UPLOAD_STORE_FILE=<path to keystore file>
# COVIDSHIELD_UPLOAD_KEY_ALIAS=<key alias>
# COVIDSHIELD_UPLOAD_STORE_PASSWORD=<store password>
# COVIDSHIELD_UPLOAD_KEY_PASSWORD=<keystore password>
```

For the `APP_ID_ANDROID` value, make sure this matches your app in the Google Play Console. Additionally, you'll need to make sure `APP_VERSION_CODE` is at least `1` higher than what you've published in the past.

### Build the Android Application Bundle

Run the following commands:

1. Clean up past builds: `yarn build-android-clean`
1. Compile and sign a release: `yarn build-android-release`

### Get the built bundle

Assuming the build and compilation went well, you should now have an `AAB` file in this location:

`android/app/build/outputs/bundle/release/app-release.aab`

### Test the build

You can install release version of your application with the following command, then find the app in the drawer.

```
yarn install-android-release
```


## Fastlane

(more to come)
