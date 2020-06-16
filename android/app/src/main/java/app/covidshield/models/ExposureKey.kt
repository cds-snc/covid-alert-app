package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class ExposureKey(
    @SerializedName("keyData") val keyData: String,
    @SerializedName("rollingStartNumber") val rollingStartNumber: Int,
    @SerializedName("rollingDuration") val rollingDuration: Int,
    @SerializedName("rollingPeriod") val rollingPeriod: Int,
    @SerializedName("transmissionRiskLevel") val transmissionRiskLevel: Int
)