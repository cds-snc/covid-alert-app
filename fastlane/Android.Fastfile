lane :ensure_keystore_properties do
  file_exists = File.exist? File.expand_path "../android/keystore.properties"

  UI.user_error!("keystore.properties file is missing!") unless file_exists
end

lane :ensure_env_file_exists do |options|
  file = options[:file]
  file_exists = File.exist? File.expand_path "../#{file}"

  UI.user_error!("#{file} environment file is missing!") unless file_exists
end

def version_string(version_number, build_number, type)
  "#{version_number} (#{build_number})"
end

platform :android do
  private_lane :build do |options|
    task = (options[:bundle] ? "bundle" : "assemble")
    properties = (options[:properties] ? options[:properties] : {})
    buildType = (options[:buildType] ? options[:buildType] : "Release")

    gradle(
      task: task,
      build_type: buildType,
      project_dir: 'android/',
      properties: properties
    )
  end

  #
  # Options:
  # - type: demo, production
  # - track: internal, alpha
  #
  lane :build_and_deploy do |options|
    # Validate options
    UI.user_error!("You must specify a build type") unless options[:type]
    buildType = options[:type]

    # Need keystore properties to publish
    ensure_keystore_properties

    # Make sure required env file exists
    env_file=".env.#{buildType}"
    ensure_env_file_exists(file: env_file)
    UI.success("Using environment file #{env_file}")

    # Load the environment
    Dotenv.overload "../#{env_file}"
    ENV["ENVFILE"] = env_file

    # Set version code and name
    versionCode = ENV["APP_VERSION_CODE"]
    versionName = version_string(ENV['APP_VERSION_NAME'], versionCode, buildType)

    # Build
    gradle(
      task: "bundle",
      build_type: "release",
      project_dir: 'android/',
      properties: {
        "versionCode" => versionCode,
        "versionName" => versionName
      }
    )

    # Deploy
    upload_to_play_store(
      track: options[:track] ? options[:track] : 'internal',
      skip_upload_apk: true,
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true,
      aab: lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      version_name: versionName,
      version_code: versionCode
    )
  end


  desc "Pushes a new build to Google Play Internal Testing Track"
  lane :internal do |options|
    # ensure_git_branch
    ensure_keystore_properties

    type = options[:type] ? options[:type] : "test"
    versionCode = ENV["APP_VERSION_CODE"]
    versionName = version_string(ENV['APP_VERSION_NAME'], ENV['APP_VERSION_CODE'])

    Dotenv.overload '../.env.beta'
    ENV["ENVFILE"] = '.env.beta'

    gradle(
      task: "bundle",
      build_type: "release",
      project_dir: 'android/',
      properties: {
        "versionCode" => versionCode,
        "versionName" => versionName
      }
    )

    upload_to_play_store(
      track: 'internal',
      skip_upload_apk: true,
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true,
      aab: lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      version_name: versionName,
      version_code: versionCode
    )

    # create_github_release(platform: "Android")
  end

  desc "Builds a local Release .apk for Android"
  lane :local do
    ensure_keystore_properties
    ensure_build_directory
    build

    APK_LOCATION = "#{lane_context[SharedValues::GRADLE_APK_OUTPUT_PATH]}"
    sh "cp #{APK_LOCATION} ../build/android/"
  end

  desc "Builds a local Debug .apk for Android"
  lane :local_debug do
    gradle(
      task: "assembleDebug",
      flags: "-DbundleInDebug=true",
      project_dir: 'android/',
    )

    APK_LOCATION = "#{lane_context[SharedValues::GRADLE_APK_OUTPUT_PATH]}"
    sh "cp #{APK_LOCATION} ../build/android/"
  end
end
