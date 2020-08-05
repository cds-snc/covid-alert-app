package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class Summary(
    @SerializedName("attenuationDurations") val attenuationDurations: List<Int>,
    @SerializedName("daysSinceLastExposure") val daysSinceLastExposure: Int,
    @SerializedName("matchedKeyCount") val matchedKeyCount: Int,
    @SerializedName("maximumRiskScore") val maximumRiskScore: Int
)
