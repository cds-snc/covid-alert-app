package app.covidshield.extensions

import app.covidshield.models.Window
import app.covidshield.models.Scan
import com.google.android.gms.nearby.exposurenotification.ExposureWindow
import com.google.android.gms.nearby.exposurenotification.ScanInstance

fun ScanInstance.toScanInstance(): Scan {
    return Scan(
            typicalAttenuation = typicalAttenuationDb,
            minAttenuation = minAttenuationDb,
            secondsSinceLastScan = secondsSinceLastScan
    )
}

 fun ExposureWindow.toExposureWindow(): Window {
     return Window(
             day = dateMillisSinceEpoch,
             scanInstances = scanInstances.map { scanInstance ->  scanInstance.toScanInstance()},
             reportType = reportType,
             infectiousness = infectiousness,
             calibrationConfidence = calibrationConfidence
     )
 }

