platform :ios do
  lane :check_version_code_exists do
    testflight_latest = latest_testflight_build_number(
      app_identifier: ENV["APP_ID"]
    )

    versions = Array(testflight_latest)

    UI.user_error!("Version code #{versions} has already been used!") if Array(versions).include? ENV['APP_VERSION_CODE'].to_i
  end

  # Saving this for later, but may not need anymore
  lane :set_version do
    # Set the version name from the environment
    increment_version_number(
      xcodeproj: "ios/CovidShield.xcodeproj",
      version_number: ENV["APP_VERSION_NAME"]
    )

    # Set the version number from the environment
    increment_build_number(
      xcodeproj: "ios/CovidShield.xcodeproj",
      build_number: ENV["APP_VERSION_CODE"]
    )
  end

  #
  # Options:
  # - type: staging, release
  #
  lane :build_and_deploy do |options|
    # Validate options
    UI.user_error!("You must specify a build type") unless options[:type]
    buildType = options[:type]
    release = options[:type] === 'production'

    # Prompt to update XCode config
    UI.user_error!("Better go do that") unless prompt(
      text: "Did you remember to check your Xcode Bundle Identifier and Provisioning Profile settings?",
      boolean: true
    )

    # Load env file
    load_env_file(buildType:buildType)

    # Check Version Code
    check_version_code_exists
    set_version

    bundle_install

    # install pods
    cocoapods(
      clean_install: true,
      podfile: 'ios/Podfile'
    )

    ensure_build_directory

    output_directory = File.expand_path('../build/ios')

    # Build the app
    build_app(
      scheme: "CovidShield",
      workspace: "./ios/CovidShield.xcworkspace",
      export_method: "app-store",
      output_directory: output_directory,
      export_options: {
        provisioningProfiles: {
          ENV["APP_ID"] => ENV["PROFILE"]
        }
      }
    )

    # Upload to TestFlight
    groups = ENV["TEST_GROUPS"].split(",")
    upload_to_testflight(
      groups: groups,
      skip_submission: true,
      ipa: lane_context[SharedValues::IPA_OUTPUT_PATH]
    )

    # Create a Github release (if it's a release)
    if release
      create_github_release(
        platform: 'iOS',
        upload_assets: [lane_context[SharedValues::IPA_OUTPUT_PATH], lane_context[SharedValues::DSYM_OUTPUT_PATH]]
      )
    end
  end

  private_lane :prepare_local do |options|
    env = (options[:env] ? options[:env] : "local")
    load_env_file(buildType:env)

    bundle_install

    # install pods
    cocoapods(
      clean_install: true,
      podfile: 'ios/Podfile'
    )

    ensure_build_directory
  end

  desc "Builds a local iOS adhoc .ipa"
  lane :local do
    prepare_local

    output_directory = File.expand_path('../build/ios')

    build_app(
      scheme: "CovidShield",
      workspace: "./ios/CovidShield.xcworkspace",
      export_method: "ad-hoc",
      output_directory: output_directory,
      export_options: {
        provisioningProfiles: {
          ENV["APP_ID"] => ENV["PROFILE_ADHOC"]
        }
      }
    )
  end

  lane :devices_file_exists do
    File.exist? File.expand_path "../fastlane/devices.txt"
  end

  desc "Adhoc build, upload to Diawi"
  lane :adhoc do |options|
    env = (options[:env] ? options[:env] : "local")
    prepare_local(env: env)

    output_directory = File.expand_path('../build/ios')

    # Register devices
    if devices_file_exists
      UI.success("Registering devices!")
      register_devices(
        devices_file: './fastlane/devices.txt',
        username: ENV['APPLE_ID']
      )
    end

    get_provisioning_profile(
      adhoc: true,
      force: true,
      app_identifier: ENV["APP_ID"],
      provisioning_name: ENV["PROFILE_ADHOC"],
      template_name: 'Exposure Notification for TEAMID (Distribution) iOS Dist ADHOC',
      output_path: './fastlane/certs/ios/',
      filename: "CovidShield_AdHoc.mobileprovision"
    )

    build_app(
      scheme: "CovidShield",
      workspace: "./ios/CovidShield.xcworkspace",
      export_method: "ad-hoc",
      output_directory: output_directory,
      export_options: {
        provisioningProfiles: {
          ENV["APP_ID"] => ENV["PROFILE_ADHOC"]
        }
      }
    )

    diawi(
      token: ENV['DIAWI_TOKEN'],
      file: lane_context[SharedValues::IPA_OUTPUT_PATH],
      find_by_udid: true,
      comment: "v#{ENV['APP_VERSION_NAME']} (#{ENV['APP_VERSION_CODE']})"
    )
  end
end
