package app.covidshield.models

import app.covidshield.utils.convertJsonToMap
import app.covidshield.utils.convertMapToJson
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.nearby.exposurenotification.ExposureInformation
import com.google.gson.Gson
import org.json.JSONObject

data class Information(
        val attenuationValue: Int,
        val date: Long,
        val duration: Int,
        val totalRiskScore: Int,
        val transmissionRiskLevel: Int
) {

    fun toMap(): WritableMap? {
        return convertJsonToMap(JSONObject(Gson().toJson(this)))
    }

    companion object {
        fun fromMap(readableMap: ReadableMap): Information {
            return Gson().fromJson(
                convertMapToJson(readableMap).toString(),
                Information::class.java
            )
        }

        fun fromExposureInformation(exposureInformation: ExposureInformation): Information {
            return Information(
                attenuationValue = exposureInformation.attenuationValue,
                date = exposureInformation.dateMillisSinceEpoch,
                duration = exposureInformation.durationMinutes,
                totalRiskScore = exposureInformation.totalRiskScore,
                transmissionRiskLevel = exposureInformation.transmissionRiskLevel
            )
        }
    }
}