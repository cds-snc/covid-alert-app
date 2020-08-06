package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class Configuration(
    @SerializedName("minimumRiskScore") val minimumRiskScore: Int,
    @SerializedName("attenuationDurationThresholds") val attenuationDurationThresholds: List<Int>,
    @SerializedName("attenuationLevelValues") val attenuationLevelValues: List<Int>,
    @SerializedName("attenuationWeight") val attenuationWeight: Int,
    @SerializedName("daysSinceLastExposureLevelValues") val daysSinceLastExposureLevelValues: List<Int>,
    @SerializedName("daysSinceLastExposureWeight") val daysSinceLastExposureWeight: Int,
    @SerializedName("durationLevelValues") val durationLevelValues: List<Int>,
    @SerializedName("durationWeight") val durationWeight: Int,
    @SerializedName("transmissionRiskLevelValues") val transmissionRiskLevelValues: List<Int>,
    @SerializedName("transmissionRiskWeight") val transmissionRiskWeight: Int
)
