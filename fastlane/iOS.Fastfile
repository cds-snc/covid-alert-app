platform :ios do
  #
  # Options:
  # - type: staging, release
  #
  lane :build_and_deploy do |options|
    # install pods
    cocoapods(
      clean_install: true,
      podfile: 'ios/Podfile'
    )

    # Validate options
    UI.user_error!("You must specify a build type") unless options[:type]
    buildType = options[:type]
    release = options[:type] === 'production'

    ensure_build_directory

    # Make sure required env file exists
    env_file=".env.#{buildType}"
    ensure_env_file_exists(file: env_file)

    # Load the environment
    Dotenv.overload "../#{env_file}"
    ENV["ENVFILE"] = env_file

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
