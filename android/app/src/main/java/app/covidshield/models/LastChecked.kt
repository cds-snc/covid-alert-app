package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class LastChecked (
    @SerializedName("period") val period: Int,
    @SerializedName("timestamp") val timestamp: Long
)