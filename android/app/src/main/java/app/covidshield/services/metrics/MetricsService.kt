package app.covidshield.services.metrics

import android.content.Context
import android.content.pm.PackageInfo
import app.covidshield.BuildConfig
import app.covidshield.extensions.log
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

object MetricsService {

    private const val metricUrl = BuildConfig.METRICS_URL
    private const val metricApiKey = BuildConfig.METRICS_API_KEY

    private val okHttpClient by lazy { OkHttpClient() }

    fun publishPackageUpdatedMetric(context: Context) {
        val jsonObject = JSONObject();

        jsonObject.put("identifier", "android-package-replaced")
        jsonObject.put("region", "None")
        jsonObject.put("timestamp", TimeUnit.MILLISECONDS.toMillis(System.currentTimeMillis()))

        val serializedGlobalMetricsPayload = serializeGlobalMetricsPayload(jsonObject, context)
        this.push(serializedGlobalMetricsPayload, context)
    }

    fun publishDebugMetric(stepNumber: Double, context: Context) {

        if (!DebugMetricsHelper.canPublishDebugMetrics(context)) return

        fun serializeMetricPayload(stepNumber: Double, lifecycleId: String, lifeCycleDailyCount: Number): JSONObject {
            val jsonObject = JSONObject();

            jsonObject.put("identifier", "ExposureNotificationCheck")
            jsonObject.put("region", "None")
            jsonObject.put("timestamp", TimeUnit.MILLISECONDS.toMillis(System.currentTimeMillis()))
            jsonObject.put("step", stepNumber.toString())
            jsonObject.put("lifecycleId", lifecycleId)
            jsonObject.put("lifeCycleDailyCount", lifeCycleDailyCount.toString())

            if (BuildConfig.TEST_MODE == "true") {
                val deviceIdentifier = DebugMetricsHelper.getDeviceIdentifier(context)
                jsonObject.put("deviceIdentifier", deviceIdentifier)
            }

            return jsonObject
        }

        val lifecycleIdentifier = DebugMetricsHelper.getLifecycleIdentifier()
        val lifecycleDailyCount = DebugMetricsHelper.getLifecycleDailyCount(context)
        val serializedMetricPayload = serializeMetricPayload(stepNumber, lifecycleIdentifier, lifecycleDailyCount)
        val serializedGlobalMetricsPayload = serializeGlobalMetricsPayload(serializedMetricPayload, context)

        this.push(serializedGlobalMetricsPayload, context)
    }

    private fun serializeGlobalMetricsPayload(metricPayload: JSONObject, context: Context): JSONObject {
        val jsonObject = JSONObject();

        jsonObject.put("metricstimestamp", TimeUnit.MILLISECONDS.toMillis(System.currentTimeMillis()))
        val info: PackageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
        jsonObject.put("appversion", info.versionName)
        jsonObject.put("appos", "android")
        jsonObject.put("osversion", android.os.Build.VERSION.SDK_INT.toString())
        jsonObject.put("manufacturer", android.os.Build.MANUFACTURER)
        jsonObject.put("model", android.os.Build.MODEL)
        jsonObject.put("androidreleaseversion", android.os.Build.VERSION.RELEASE)

        val jsonArray = JSONArray()
        jsonArray.put(metricPayload)

        jsonObject.put("payload", jsonArray)

        return jsonObject
    }

    private fun push(globalMetricsPayload: JSONObject, context: Context) {
        val body: RequestBody = RequestBody.create(MediaType.parse("text/plain"), globalMetricsPayload.toString())

        val request = Request.Builder()
                .url(metricUrl)
                .header("Accept", "application/json")
                .addHeader("Content-Type", "text/plain")
                .addHeader("x-api-key", metricApiKey)
                .cacheControl(CacheControl.Builder().noStore().build())
                .post(body)
                .build()

        okHttpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    log(globalMetricsPayload.toString(), mapOf("response" to response.isSuccessful), "AndroidMetric")
                    if (!response.isSuccessful) throw IOException("Unexpected code $response")
                }
            }
        })
    }

}