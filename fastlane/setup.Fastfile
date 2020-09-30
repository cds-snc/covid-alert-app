lane :development_setup do
  get_certificates(
    development: true,
    username: ENV["APPLE_ID"],
    output_path: './fastlane/certs/ios/'
  )

  # Get Staging Development Profile
  get_provisioning_profile(
    development: true,
    readonly: true,
    app_identifier: 'ca.gc.hcsc.canada.covidalert.dev',
    provisioning_name: 'COVID Alert Development',
    template_name: 'Exposure Notification with Logging Support for J7J9Q6KTWJ (Dev) iOS Dev',
    output_path: './fastlane/certs/ios/',
    filename: "CovidAlert_Development.mobileprovision"
  )

  # Get Production Development Profile
  get_provisioning_profile(
    development: true,
    readonly: true,
    app_identifier: 'ca.gc.hcsc.canada.stopcovid',
    provisioning_name: 'Stop COVID Development',
    template_name: 'Exposure Notification with Logging Support for J7J9Q6KTWJ (Dev) iOS Dev',
    output_path: './fastlane/certs/ios/',
    filename: "StopCovid_Development.mobileprovision"
  )
end

lane :distribution_setup do
  get_certificates(
    username: ENV["APPLE_ID"],
    output_path: './fastlane/certs/ios/'
  )

  staging_profiles
  production_profiles
end

lane :staging_profiles do
  # Get Staging AdHoc Profile
  get_provisioning_profile(
    adhoc: true,
    force: true,
    app_identifier: 'ca.gc.hcsc.canada.covidalert.dev',
    provisioning_name: 'COVID Alert AdHoc',
    template_name: 'Exposure Notification for TEAMID (Distribution) iOS Dist ADHOC',
    output_path: './fastlane/certs/ios/',
    filename: "CovidAlert_AdHoc.mobileprovision"
  )

  # Get Staging AppStore Profile
  get_provisioning_profile(
    readonly: true,
    app_identifier: 'ca.gc.hcsc.canada.covidalert.dev',
    provisioning_name: 'COVID Alert AppStore DEV',
    template_name: 'Exposure Notification for TEAMID (Distribution) iOS Dist',
    output_path: './fastlane/certs/ios/',
    filename: "CovidAlert_AppStore.mobileprovision"
  )
end

lane :production_profiles do
  # Get Production AdHoc Profile
  get_provisioning_profile(
    adhoc: true,
    force: true,
    app_identifier: 'ca.gc.hcsc.canada.stopcovid',
    provisioning_name: 'Stop COVID AdHoc',
    template_name: 'Exposure Notification for TEAMID (Distribution) iOS Dist ADHOC',
    output_path: './fastlane/certs/ios/',
    filename: "StopCovid_AdHoc.mobileprovision"
  )

  # Get Production AppStore Profile
  get_provisioning_profile(
    readonly: true,
    app_identifier: 'ca.gc.hcsc.canada.stopcovid',
    provisioning_name: 'Stop COVID App Store Profile',
    template_name: 'Exposure Notification for TEAMID (Distribution) iOS Dist',
    output_path: './fastlane/certs/ios/',
    filename: "StopCovid_AppStore.mobileprovision"
  )
end

lane :setup do
  development_setup
  distribution_setup
end
