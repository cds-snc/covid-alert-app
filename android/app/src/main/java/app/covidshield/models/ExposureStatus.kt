package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class ExposureStatus(
        @SerializedName("type") val type: String,
        @SerializedName("lastChecked") val lastChecked: LastChecked
)