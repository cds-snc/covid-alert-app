package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class ExposureKey(
    @SerializedName("transmissionRiskLevel") val transmissionRiskLevel: Int,
    @SerializedName("keyData") val keyData: String,
    @SerializedName("rollingStartNumber") val rollingStartNumber: Int,
    @SerializedName("rollingStartIntervalNumber") val rollingStartIntervalNumber: Int
)