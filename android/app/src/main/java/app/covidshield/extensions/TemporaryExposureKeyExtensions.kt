package app.covidshield.extensions

import android.util.Base64
import app.covidshield.models.ExposureKey
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey

fun TemporaryExposureKey.toExposureKey(): ExposureKey {
    return ExposureKey(
        keyData = Base64.encodeToString(keyData, Base64.NO_WRAP),
        rollingStartNumber = rollingStartIntervalNumber,
        rollingPeriod = rollingPeriod,
        transmissionRiskLevel = transmissionRiskLevel
    )
}