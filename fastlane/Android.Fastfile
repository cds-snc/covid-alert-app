lane :ensure_keystore_properties do
  file_exists = File.exist? File.expand_path "../android/keystore.properties"

  UI.user_error!("keystore.properties file is missing!") unless file_exists
end

def version_string(version_number, build_number, type)
  "#{version_number} (#{build_number})"
end

platform :android do
  lane :check_version_code_exists do
    play_versions = google_play_track_version_codes(
      track: 'internal'
    )

    versions = Array(play_versions)

    UI.user_error!("Version code #{versions} has already been used!") if Array(versions).include? ENV['APP_VERSION_CODE'].to_i
  end

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
  # - type: staging, production
  # - track (optional): internal (default), alpha
  #
  lane :build_and_deploy do |options|
    # Validate options
    UI.user_error!("You must specify a build type") unless options[:type]
    buildType = options[:type]
    deployToTrack = options[:track] ? options[:track] : 'internal'
    release = options[:type] === 'production'

    # Need keystore properties to publish
    ensure_keystore_properties

    # Load env file
    load_env_file(buildType:buildType)

    # Check Version Code
    check_version_code_exists

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
      track: deployToTrack,
      skip_upload_apk: true,
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true,
      aab: lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      version_name: versionName,
      version_code: versionCode
    )

    # Tag a release on Github (if it's a release)
    if release
      create_github_release(platform: "Android")
    end
  end

  desc "Builds a local Release .apk for Android"
  lane :local do
    load_env_file(buildType:'local')

    ensure_keystore_properties
    ensure_build_directory

    gradle(
      task: "assemble",
      build_type: "Release",
      project_dir: 'android/'
    )

    output_directory = File.expand_path('../build/android')
    APK_LOCATION = "#{lane_context[SharedValues::GRADLE_APK_OUTPUT_PATH]}"
    sh "cp #{APK_LOCATION} #{output_directory}"
  end

  lane :adhoc do
    local

    diawi(
      token: ENV['DIAWI_TOKEN'],
      file: lane_context[SharedValues::GRADLE_APK_OUTPUT_PATH],
      comment: "v#{ENV['APP_VERSION_NAME']} (#{ENV['APP_VERSION_CODE']})",
      callback_emails: "dave.samojlenko@cds-snc.ca"
    )
  end

  desc "Builds a local Debug .apk for Android"
  lane :local_debug do
    load_env_file(buildType:'local')

    gradle(
      task: "assembleDebug",
      flags: "-DbundleInDebug=true",
      project_dir: 'android/',
    )

    APK_LOCATION = "#{lane_context[SharedValues::GRADLE_APK_OUTPUT_PATH]}"
    sh "cp #{APK_LOCATION} ../build/android/"
  end
end
