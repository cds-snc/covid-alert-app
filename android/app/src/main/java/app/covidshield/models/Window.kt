package app.covidshield.models

import com.google.gson.annotations.SerializedName

data class Window(
    @SerializedName("day") val day: Long,
    @SerializedName("scanInstances") val scanInstances: List<Scan>,
    @SerializedName("reportType") val reportType: Int,
    @SerializedName("infectiousness") val infectiousness: Int,
    @SerializedName("calibrationConfidence") val calibrationConfidence: Int
)

data class Scan(
        @SerializedName("typicalAttenuation") val typicalAttenuation: Int,
        @SerializedName("minAttenuation") val minAttenuation: Int,
        @SerializedName("secondsSinceLastScan") val secondsSinceLastScan: Int
)
