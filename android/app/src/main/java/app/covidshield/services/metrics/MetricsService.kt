package app.covidshield.services.metrics

import android.content.Context
import android.content.pm.PackageInfo
import app.covidshield.BuildConfig
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

enum class MetricType(val identifier: String) {
    PackageUpdated("android-package-replaced"),
    ScheduledCheckStartedToday("scheduled-check-started-today"),
    ScheduledCheckSuccessfulToday("scheduled-check-successful-today")
}

object MetricsService {

    private const val metricUrl = BuildConfig.METRICS_URL
    private const val metricApiKey = BuildConfig.METRICS_API_KEY

    private val okHttpClient by lazy { OkHttpClient() }

    fun publishMetric(type: MetricType, oncePerUTCDay: Boolean, context: Context) {

        fun pushMetric() {
            val jsonObject = JSONObject();

            jsonObject.put("identifier", type.identifier)
            jsonObject.put("region", "None")
            jsonObject.put("timestamp", System.currentTimeMillis())

            val serializedGlobalMetricsPayload = serializeGlobalMetricsPayload(jsonObject, context)
            this.push(serializedGlobalMetricsPayload)
        }

        if (oncePerUTCDay) {
            if (UniqueDailyMetricsHelper.canPublishMetric(type.identifier, context)) {
                pushMetric()
                UniqueDailyMetricsHelper.markMetricAsPublished(type.identifier, context)
            }
        } else {
            pushMetric()
        }
    }

    @JvmStatic
    @JvmOverloads
    fun publishDebugMetric(stepNumber: Double, context: Context, message: String = "n/a", oncePerUTCDay: Boolean = false) {

        if (!DebugMetricsHelper.canPublishDebugMetrics(context)) return

        fun pushMetric() {

            fun serializeMetricPayload(stepNumber: Double, lifecycleId: String, lifeCycleDailyCount: Number, successfulDailyBackgroundChecks: Number): JSONObject {
                val jsonObject = JSONObject();

                jsonObject.put("identifier", "ExposureNotificationCheck")
                jsonObject.put("region", "None")
                jsonObject.put("timestamp", System.currentTimeMillis())
                jsonObject.put("step", stepNumber.toString())
                jsonObject.put("lifecycleId", lifecycleId)
                jsonObject.put("lifeCycleDailyCount", lifeCycleDailyCount.toString())
                jsonObject.put("successfulDailyBackgroundChecks", successfulDailyBackgroundChecks.toString())
                jsonObject.put("message", message)

                if (BuildConfig.TEST_MODE == "true") {
                    val deviceIdentifier = DebugMetricsHelper.getDeviceIdentifier(context)
                    jsonObject.put("deviceIdentifier", deviceIdentifier)
                }

                return jsonObject
            }

            val lifecycleIdentifier = DebugMetricsHelper.getLifecycleIdentifier()
            val lifecycleDailyCount = DebugMetricsHelper.getLifecycleDailyCount(context)
            val successfulDailyBackgroundChecks = DebugMetricsHelper.getSuccessfulDailyBackgroundChecks(context)
            val serializedMetricPayload = serializeMetricPayload(stepNumber, lifecycleIdentifier, lifecycleDailyCount, successfulDailyBackgroundChecks)
            val serializedGlobalMetricsPayload = serializeGlobalMetricsPayload(serializedMetricPayload, context)

            this.push(serializedGlobalMetricsPayload)
        }

        if (oncePerUTCDay) {
            if (UniqueDailyMetricsHelper.canPublishMetric(stepNumber.toString(), context)) {
                pushMetric()
                UniqueDailyMetricsHelper.markMetricAsPublished(stepNumber.toString(), context)
            }
        } else {
            pushMetric()
        }
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

    private fun push(globalMetricsPayload: JSONObject) {
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
            }
        })
    }

}