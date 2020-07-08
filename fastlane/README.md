fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### create_github_release
```
fastlane create_github_release
```
Creates a Github Release
### default_changelog
```
fastlane default_changelog
```
Returns a default changelog.
### ensure_keystore_properties
```
fastlane ensure_keystore_properties
```


----

## iOS
### ios beta
```
fastlane ios beta
```
Submit a new Covid Alert beta build to Apple TestFlight
### ios local
```
fastlane ios local
```
Builds a local iOS adhoc .ipa

----

## Android
### android internal
```
fastlane android internal
```
Pushes a new build to Google Play Internal Testing Track
### android local
```
fastlane android local
```
Builds a local Release .apk for Android
### android local_debug
```
fastlane android local_debug
```
Builds a local Debug .apk for Android

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
