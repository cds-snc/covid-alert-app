platform :ios do
  lane :check_version_code_exists do
    testflight_latest = latest_testflight_build_number(
      app_identifier: ENV["APP_ID_IOS"]
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
          ENV["APP_ID_IOS"] => ENV["PROFILE"]
        }
      }
    )

    # Upload to TestFlight
    groups = ENV["TEST_GROUPS"].split(",")
    upload_to_testflight(
      groups: groups,
      ipa: "#{output_directory}/CovidShield.ipa"
    )

    # Create a Github release (if it's a release)
    if release
      create_github_release(
        platform: 'iOS',
        upload_assets: ["#{output_directory}/CovidShield.ipa", "#{output_directory}/CovidShield.app.dSYM.zip"]
      )
    end
  end

  desc "Builds a local iOS adhoc .ipa"
  lane :local do
    bundle_install

    # install pods
    cocoapods(
      clean_install: true,
      podfile: 'ios/Podfile'
    )

    ensure_build_directory

    output_directory = File.expand_path('../build/ios')

    build_app(
      scheme: "CovidShield",
      workspace: "./ios/CovidShield.xcworkspace",
      export_method: "ad-hoc",
      output_directory: output_directory,
      export_options: {
        provisioningProfiles: {
          ENV["APP_ID_IOS"] => ENV["PROFILE_ADHOC"]
        }
      }
    )
  end
end
