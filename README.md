# COVID Shield Mobile App

![Lint + Typscript](https://github.com/CovidShield/mobile/workflows/CI/badge.svg)

This repository implements a React Native _client application_ for Apple/Google's [Exposure
Notification](https://www.apple.com/covid19/contacttracing) framework, informed by the [guidance provided by Canada's Privacy Commissioners](https://priv.gc.ca/en/opc-news/speeches/2020/s-d_20200507/). For more information on how this all works, read through the [COVID Shield Rationale](https://github.com/CovidShield/rationale).

- [Overview](#overview)
- [User experience](#user-experience)
- [Local development](#local-development)
- [Customization](#customization)
- [Localization](#localization)

## Overview

This app is built using React Native and designed to work well with patterns on both Android and iOS devices. It works alongside the [COVID Shield Diagnosis Server](https://github.com/CovidShield/backend) to provide a reference for how a client application for exposure notifications could work.

### Screenshots

![Three iOS devices showing the default screen, an exposure notification, and the detail screen in COVID Shield mobile app](https://github.com/CovidShield/rationale/raw/master/assets/ios-screens.png)

## User Experience

### Aurora Design System

COVID Shield follows design and content guidelines from the [Aurora Design System](https://design.gccollab.ca/) published by the Government of Canada's Digital Enablement Service.

#### Typeface

The Aurora Design System recommends Nunito for the app's main typeface. You can [download this font from Google Fonts](https://fonts.google.com/specimen/Nunito) or access it directly using the Google Fonts integration in Figma.

#### Inspiration

Our onboarding flow was inspired in part by the work done in [this Medium article](https://onezero.medium.com/openui-a6b9c3d741de) which is shared under the [CC 4.0 license](https://creativecommons.org/licenses/by/4.0/). Thanks to [@jelle.prins](https://twitter.com/jelleprins) and [@ppkorevaar](https://twitter.com/ppkorevaar) for their initial work.

### Design

- Our [wired Figma prototype](https://www.figma.com/proto/b76OYDhkTKJCaqDfVQybQY/Open-Source-COVID-Shield?node-id=324%3A3825&viewport=387%2C570%2C0.125&scaling=scale-down)
- Our [design working files on Figma](https://www.figma.com/file/b76OYDhkTKJCaqDfVQybQY/Open-Source-COVID-Shield?node-id=1%3A18).
- Our [illustration and animation assets](design/)

### Content

Our [glossary of terms](https://github.com/CovidShield/rationale/blob/master/GLOSSARY.md).

## Local development

### Prerequisites

Follow the steps outlined in [React Native Development Environment Setup](https://reactnative.dev/docs/environment-setup) to make sure you have the proper tools installed.

#### Node

- [Node 12 LTS](https://nodejs.org/en/download/)

#### iOS

- Xcode 11.5 or greater
- iOS device or simulator with iOS 13.5 or greater
- [Bundler](https://bundler.io/) to install the right version of CocoaPods locally
- You also need a provisioning profile with the Exposure Notification entitlement. For more information, visit https://developer.apple.com/documentation/exposurenotification.

#### Android

- Android device with the ability to run the latest version of Google Play Services or Google Play Services Beta. Sign up for beta program here https://developers.google.com/android/guides/beta-program.
- You also need a whitelisted APPLICATION_ID that will be used to publish to Google Play. You could use APPLICATION_ID from [Google Sample App](https://github.com/google/exposure-notifications-android) for testing purposes `"com.google.android.apps.exposurenotification"`. Go to [Environment config](https://github.com/CovidShield/mobile#3-environment-config) to see how to change APPLICATION_ID.

#### 1. Check out the repository

```bash
git clone git@github.com:CovidShield/mobile.git
```

#### 2. Install dependencies

```bash
yarn install
```

##### 2.1 Additional step for iOS

###### 2.1.1 Install Cocoapods

```bash
sudo gem install cocoapods
```

###### 2.1.2 Install pods

```bash
bundle install && yarn pod-install
```

#### 3. Environment config

Check `.env` and adjust configuration if necessary. See [react-native-config](https://www.npmjs.com/package/react-native-config#different-environments) for more information.

Ex:

```bash
ENVFILE=.env.production yarn run-ios
ENVFILE=.env.production yarn run-android
```

#### 4. Start app in development mode

You can now launch the app using the following commands for both iOS and Android.

```bash
yarn run-ios
yarn run-android
```

You can also build the app with native development tool:

- For iOS, using Xcode by opening the `CovidShield.xcworkspace` file in the `ios` folder.
- For Android, using Android Studio by opening `android` folder.

### Development mode

When the app is running development mode, you can tap on the COVID Shield logo at the top of the app to open the Test menu. This menu enables you to:

- Put the app into test mode to bypass the Exposure Notification API check
- Change the system status
- Change the exposure status
- Send a sample notification
- Reset the app to onboarding state

Note that: Test menu is enabled if the environment config file (`.env*`) has `TEST_MODE=true`. To disable test mode UI on production build, simply set it to false in the environment config file `TEST_MODE=false`.

## Customization

You can customize the look and feel of the app largely by editing values found in the [Theme File](https://github.com/CovidShield/mobile/blob/master/src/shared/theme.ts)

## Localization

The COVID Shield app is available in French and English. Fully localized content can be modified by editing translations files found in the [translations directory](https://github.com/CovidShield/mobile/tree/master/src/locale/translations). More translations can be added by using the same mechanism as French and English.

After modifying the content you must run the `generate-translations` command in order for the app to reflect your changes.

```bash
yarn generate-translations
```

### Add new translation

1. Create a new i18n file in [src/locale/translations/](./src/locale/translations/).
2. Add the new option `pt` in [translations.js](./translations.js).
3. Regenerate the translations `yarn generate-translations`.
4. Add the new option in [src/components/LanguageToggle.tsx](./src/components/LanguageToggle.tsx).
5. Add the new option in [src/screens/language/Language.tsx](./src/screens/language/Language.tsx).
6. Add the new option in Xcode `Localizations` settings (Project -> CovidShield -> Info tab -> Localizations) and make sure `Launch Screen.storyboard` is checked.

## Who built COVID Shield?

We are a group of Shopify volunteers who want to help to slow the spread of COVID-19 by offering our
skills and experience developing scalable, easy to use applications. We are releasing COVID Shield
free of charge and with a flexible open-source license.

For questions, we can be reached at <press@covidshield.app>.

## Troubleshooting

### [Android] Problem with debug.keystore during run Android version

Logs

```bash
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:packageDebug'.
> A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
   > com.android.ide.common.signing.KeytoolException: Failed to read key AndroidDebugKey from store "/Users/YOUR_USER/.android/debug.keystore": keystore password was incorrect
```

Generate a new `debug.keystore`:

```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

Copy your debug.keystore to `~/.android/debug.keystore`:

```bash
cd android/app
cp debug.keystore ~/.android/debug.keystore
```

Now you can run `yarn run-android` in your root folder.
