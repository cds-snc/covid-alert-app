package app.covidshield.extensions

import app.covidshield.models.ExposureKey
import com.google.android.gms.common.util.Hex
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey

fun TemporaryExposureKey.toExposureKey(): ExposureKey {
    return ExposureKey(
        keyData = Hex.bytesToStringLowercase(keyData),
        rollingStartNumber = rollingStartIntervalNumber,
        rollingDuration = rollingStartIntervalNumber,
        rollingPeriod = rollingPeriod,
        transmissionRiskLevel = transmissionRiskLevel
    )
}