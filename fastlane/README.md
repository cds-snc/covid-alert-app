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
### ensure_keystore_properties
```
fastlane ensure_keystore_properties
```

### load_env_file
```
fastlane load_env_file
```

### get_latest_version
```
fastlane get_latest_version
```
Get latest version number
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
### ensure_build_directory
```
fastlane ensure_build_directory
```

### ensure_env_file_exists
```
fastlane ensure_env_file_exists
```

### ensure_translations_generated
```
fastlane ensure_translations_generated
```


----

## Android
### android check_version_code_exists
```
fastlane android check_version_code_exists
```

### android build_and_deploy
```
fastlane android build_and_deploy
```

### android local
```
fastlane android local
```
Builds a local Release .apk for Android
### android adhoc
```
fastlane android adhoc
```

### android local_debug
```
fastlane android local_debug
```
Builds a local Debug .apk for Android

----

## iOS
### ios check_version_code_exists
```
fastlane ios check_version_code_exists
```

### ios set_version
```
fastlane ios set_version
```

### ios build_and_deploy
```
fastlane ios build_and_deploy
```

### ios devices_file_exists
```
fastlane ios devices_file_exists
```

### ios adhoc
```
fastlane ios adhoc
```
Adhoc build, upload to Diawi

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
