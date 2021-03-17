package app.covidshield.services.metrics

import android.util.Log
import app.covidshield.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject

object DebugMetricsActivator {

    private const val configurationUrl = BuildConfig.RETRIEVE_URL + "/exposure-configuration/CA.json"

    private val okHttpClient by lazy { OkHttpClient() }

    private var cachedActivationFlag: Boolean? = null

    fun canPublishDebugMetrics(): Boolean {
        return if (cachedActivationFlag == null) {
            Log.d("CovidShield", "HERE")
            val request = Request.Builder().url(configurationUrl).build()

            val isActive = okHttpClient.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val jsonObject = JSONObject(response.body()!!.string())
                    val testValue = jsonObject.getInt("minimumRiskScore")
                    testValue == 0
                } else {
                    true
                }
            }

            cachedActivationFlag = isActive
            isActive
        } else {
            cachedActivationFlag!!
        }
    }
}