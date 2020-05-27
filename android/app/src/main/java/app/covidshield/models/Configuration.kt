package app.covidshield.models

import app.covidshield.utils.convertJsonToMap
import app.covidshield.utils.convertMapToJson
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.nearby.exposurenotification.ExposureConfiguration
import com.google.gson.Gson
import org.json.JSONObject

data class Configuration(
        val minimumRiskScore: Int,
        val attenuationLevelValues: List<Int>,
        val attenuationWeight: Int,
        val daysSinceLastExposureLevelValues: List<Int>,
        val daysSinceLastExposureWeight: Int,
        val durationLevelValues: List<Int>,
        val durationWeight: Int,
        val transmissionRiskLevelValues: List<Int>,
        val transmissionRiskWeight: Int
) {
    fun toGoogleConfig(): ExposureConfiguration {
        return ExposureConfiguration.ExposureConfigurationBuilder()
                .setMinimumRiskScore(minimumRiskScore)
                .setAttenuationScores(*attenuationLevelValues.toIntArray())
                .setAttenuationWeight(attenuationWeight)
                .setDaysSinceLastExposureScores(*daysSinceLastExposureLevelValues.toIntArray())
                .setDaysSinceLastExposureWeight(daysSinceLastExposureWeight)
                .setDurationScores(*durationLevelValues.toIntArray())
                .setDurationWeight(durationWeight)
                .setTransmissionRiskScores(*transmissionRiskLevelValues.toIntArray())
                .setTransmissionRiskWeight(transmissionRiskWeight)
                .build()
    }

    fun toMap(): WritableMap? {
        return convertJsonToMap(JSONObject(Gson().toJson(this)))
    }

    companion object {
        fun fromMap(readableMap: ReadableMap): Configuration {
            return Gson().fromJson(
                    convertMapToJson(readableMap).toString(),
                    Configuration::class.java
            )
        }
    }
}