package app.covidshield.extensions

import app.covidshield.models.Information
import com.google.android.gms.nearby.exposurenotification.ExposureInformation

fun ExposureInformation.toInformation(): Information {
    return Information(
        attenuationValue = attenuationValue,
        date = dateMillisSinceEpoch,
        duration = durationMinutes,
        totalRiskScore = totalRiskScore,
        transmissionRiskLevel = transmissionRiskLevel
    )
}