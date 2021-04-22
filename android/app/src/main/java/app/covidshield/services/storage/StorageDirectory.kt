package app.covidshield.services.storage

object StorageDirectory {
    val ExposureStatus: KeyDefinition = Unsecure ("exposureStatus")
    val MetricsFilterStateStorageBackgroundCheckEventMarkerKey = Secure ("AB398409-D8A9-4BC2-91F0-63E4CEFCD89A")
}