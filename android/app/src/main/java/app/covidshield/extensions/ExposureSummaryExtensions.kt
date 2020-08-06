package app.covidshield.extensions

import app.covidshield.models.Summary
import com.google.android.gms.nearby.exposurenotification.ExposureSummary

fun ExposureSummary.toSummary(): Summary {
    return Summary(
        attenuationDurations = attenuationDurationsInMinutes.toList(),
        daysSinceLastExposure = daysSinceLastExposure,
        matchedKeyCount = matchedKeyCount,
        maximumRiskScore = maximumRiskScore
    )
}