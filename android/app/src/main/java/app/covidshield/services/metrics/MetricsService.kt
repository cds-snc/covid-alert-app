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
        this.push(serializedGlobalMetricsPayload)
    }

    @JvmStatic
    @JvmOverloads
    fun publishDebugMetric(stepNumber: Double, context: Context, message: String = "n/a") {

        if (!DebugMetricsHelper.canPublishDebugMetrics(context)) return

        fun serializeMetricPayload(stepNumber: Double, lifecycleId: String, lifeCycleDailyCount: Number, successfulDailyBackgroundChecks: Number): JSONObject {
            val jsonObject = JSONObject();

            jsonObject.put("identifier", "ExposureNotificationCheck")
            jsonObject.put("region", "None")
            jsonObject.put("timestamp", TimeUnit.MILLISECONDS.toMillis(System.currentTimeMillis()))
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

        // This is the current final step we have and it is published from the React layer
        if (stepNumber == 8.0) DebugMetricsHelper.incrementSuccessfulDailyBackgroundChecks(context)

        val lifecycleIdentifier = DebugMetricsHelper.getLifecycleIdentifier()
        val lifecycleDailyCount = DebugMetricsHelper.getLifecycleDailyCount(context)
        val successfulDailyBackgroundChecks = DebugMetricsHelper.getSuccessfulDailyBackgroundChecks(context)
        val serializedMetricPayload = serializeMetricPayload(stepNumber, lifecycleIdentifier, lifecycleDailyCount, successfulDailyBackgroundChecks)
        val serializedGlobalMetricsPayload = serializeGlobalMetricsPayload(serializedMetricPayload, context)

        this.push(serializedGlobalMetricsPayload)
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