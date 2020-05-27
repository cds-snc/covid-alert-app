package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class Information(
    @SerializedName("attenuationValue") val attenuationValue: Int,
    @SerializedName("date") val date: Long,
    @SerializedName("duration") val duration: Int,
    @SerializedName("totalRiskScore") val totalRiskScore: Int,
    @SerializedName("transmissionRiskLevel") val transmissionRiskLevel: Int
)
