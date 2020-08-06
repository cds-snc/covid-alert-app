package app.covidshield.extensions

import app.covidshield.models.Configuration
import com.google.android.gms.nearby.exposurenotification.ExposureConfiguration

fun Configuration.toExposureConfiguration(): ExposureConfiguration {
    return ExposureConfiguration.ExposureConfigurationBuilder()
        .setMinimumRiskScore(minimumRiskScore)
        .setAttenuationScores(*attenuationLevelValues.toIntArray())
        .setAttenuationWeight(attenuationWeight)
        .setDaysSinceLastExposureScores(*daysSinceLastExposureLevelValues.toIntArray())
        .setDaysSinceLastExposureWeight(daysSinceLastExposureWeight)
        .setDurationScores(*durationLevelValues.toIntArray())
        .setDurationWeight(durationWeight)
        .setDurationAtAttenuationThresholds(attenuationDurationThresholds[0], attenuationDurationThresholds[1])
        .setTransmissionRiskScores(*transmissionRiskLevelValues.toIntArray())
        .setTransmissionRiskWeight(transmissionRiskWeight)
        .build()
}