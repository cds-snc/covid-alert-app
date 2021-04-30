package app.covidshield.services.storage

object StorageDirectory {

    // Shared between React and Kotlin

    val ExposureStatus: KeyDefinition = Unsecure("exposureStatus")
    val MetricsFilterStateStorageBackgroundCheckEventMarkerKey = Secure("AB398409-D8A9-4BC2-91F0-63E4CEFCD89A")

    // Kotlin only

    val KotlinMetricsStorageKey = Secure("1357FED4-DCB7-4BA7-9E39-13A31F94E822")
    val KotlinMetricsServiceLastMetricTimestampSentToTheServerKey = Secure("26FE7FB9-81F7-46F0-8063-A03E4A4B2EAD")
    val KotlinMetricsServiceMetricsLastUploadedDateTimeKey = Secure("2B57B0D9-8F76-478E-938A-776C5F5A7D35")
}