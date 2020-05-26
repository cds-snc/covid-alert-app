package app.covidshield.models

import app.covidshield.utils.convertJsonToMap
import app.covidshield.utils.convertMapToJson
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.common.util.Hex
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.gson.Gson
import org.json.JSONObject

data class ExposureKey(
        val transmissionRiskLevel: Int,
        val keyData: String,
        val rollingStartNumber: Int
) {

    fun toMap(): WritableMap? {
        return convertJsonToMap(JSONObject(Gson().toJson(this)))
    }

    companion object {
        fun fromMap(readableMap: ReadableMap?): ExposureKey {
            return Gson().fromJson(
                    convertMapToJson(readableMap).toString(),
                    ExposureKey::class.java
            )
        }

        fun fromGoogleKey(key: TemporaryExposureKey): ExposureKey {
            return ExposureKey(
                    transmissionRiskLevel = key.transmissionRiskLevel,
                    keyData = Hex.bytesToStringLowercase(key.keyData),
                    rollingStartNumber = key.rollingStartIntervalNumber
            )
        }
    }
}