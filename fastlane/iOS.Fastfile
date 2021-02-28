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

    # Load env file
    load_env_file(buildType:buildType)

    # Check required env vars
    UI.user_error!("Missing XCODE_SCHEME environment variable") unless ENV['XCODE_SCHEME']

    # Check that translations have been generated
    ensure_translations_generated

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
      scheme: ENV["XCODE_SCHEME"],
      workspace: "./ios/CovidShield.xcworkspace",
      export_method: "app-store",
      output_directory: output_directory,
    )

    # Upload to TestFlight
    upload_to_testflight(
      skip_submission: true,
      ipa: lane_context[SharedValues::IPA_OUTPUT_PATH]
    )

    # Create a Github release (if it's a release)
    if release
      ensure_nsapptransportsecurity_is_not_set(ipa:lane_context[SharedValues::IPA_OUTPUT_PATH])
      create_github_release(
        platform: 'iOS',
        upload_assets: [lane_context[SharedValues::IPA_OUTPUT_PATH], lane_context[SharedValues::DSYM_OUTPUT_PATH]]
      )
    end
  end

  lane :devices_file_exists do
    File.exist? File.expand_path "../fastlane/devices.txt"
  end
  
  desc "Ensure that there are no NSAppTransportSecurity keys in the Info.plist"
  lane :ensure_nsapptransportsecurity_is_not_set do |options|
    atskey = get_ipa_info_plist_value( ipa:options[:ipa], key:"NSAppTransportSecurity")
    UI.user_error!("IPA has NSAppTransportSecurity set") unless atskey.nil?
  end
  
  desc "Adhoc build, upload to Diawi"
  lane :adhoc do |options|
    env = (options[:env] ? options[:env] : "local")
    load_env_file(buildType:env)

    # Check required env vars
    UI.user_error!("Missing APPLE_ID environment variable") unless ENV['APPLE_ID']
    UI.user_error!("Missing APP_ID environment variable") unless ENV['APP_ID']
    UI.user_error!("Missing XCODE_PROFILE environment variable") unless ENV['XCODE_PROFILE']
    UI.user_error!("Missing TEMPLATE environment variable") unless ENV['TEMPLATE']
    UI.user_error!("Missing XCODE_SCHEME environment variable") unless ENV['XCODE_SCHEME']
    UI.user_error!("Missing DIAWI_TOKEN environment variable") unless ENV['DIAWI_TOKEN']
    UI.user_error!("Missing APP_VERSION_NAME environment variable") unless ENV['APP_VERSION_NAME']
    UI.user_error!("Missing APP_VERSION_CODE environment variable") unless ENV['APP_VERSION_CODE']

    bundle_install

    # install pods
    cocoapods(
      clean_install: true,
      podfile: 'ios/Podfile'
    )

    ensure_build_directory

    output_directory = File.expand_path('../build/ios')

    # Register devices
    if devices_file_exists
      UI.success("Registering devices!")
      register_devices(
        devices_file: './fastlane/devices.txt',
        username: ENV['APPLE_ID']
      )
    end

    # For AdHoc builds we want to force regeneration of the
    # Provisioning Profile so we can ensure all registered
    # devices are added to the profile
    match(
      type: "adhoc",
      app_identifier: ENV["APP_ID"],
      force_for_new_devices: true,
      template_name: ENV["TEMPLATE"],
      readonly: true,
    )

    build_app(
      scheme: ENV["XCODE_SCHEME"],
      workspace: "./ios/CovidShield.xcworkspace",
      export_method: "ad-hoc",
      output_directory: output_directory,
    )

    diawi(
      token: ENV['DIAWI_TOKEN'],
      file: lane_context[SharedValues::IPA_OUTPUT_PATH],
      find_by_udid: true,
      comment: "v#{ENV['APP_VERSION_NAME']} (#{ENV['APP_VERSION_CODE']})"
    )
  end
end
