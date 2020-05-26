package app.covidshield.models

import app.covidshield.utils.convertJsonToMap
import app.covidshield.utils.convertMapToJson
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.nearby.exposurenotification.ExposureSummary
import com.google.gson.Gson
import org.json.JSONObject

data class Summary(
        val daysSinceLastExposure: Int,
        val matchedKeyCount: Int,
        val maximumRiskScore: Int
) {
    fun toMap(summary: Summary): WritableMap? {
        return convertJsonToMap(JSONObject(Gson().toJson(summary)))
    }

    companion object {
        fun fromMap(readableMap: ReadableMap): Summary {
            return Gson().fromJson(convertMapToJson(readableMap).toString(), Summary::class.java)
        }

        fun fromExposureSummary(summary: ExposureSummary): Summary {
            return Summary(daysSinceLastExposure = summary.daysSinceLastExposure, matchedKeyCount = summary.matchedKeyCount, maximumRiskScore = summary.maximumRiskScore)
        }
    }
}