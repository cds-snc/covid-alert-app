package app.covidshield.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInfo
import app.covidshield.BuildConfig
import app.covidshield.extensions.log
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit.MILLISECONDS

class PackageReceiver () : BroadcastReceiver() {

    private val okHttpClient by lazy { OkHttpClient() }

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        log("onReceive", mapOf("action" to action))

            if (action == "android.intent.action.MY_PACKAGE_REPLACED") {
                val info: PackageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
                val versionName = info.versionName
                val timestamp = MILLISECONDS.toMillis(System.currentTimeMillis())
                val metricUrl = BuildConfig.METRICS_URL
                val metricApiKey = BuildConfig.METRICS_API_KEY

                val metricJson = JSONObject();
                metricJson.put("metricstimestamp", timestamp)
                metricJson.put("appversion", versionName)
                metricJson.put("appos", "android")
                metricJson.put("osversion", android.os.Build.VERSION.SDK_INT)
                val metricPayload = JSONObject();
                metricPayload.put("identifier", "android-package-replaced")
                metricPayload.put("region", "None")
                metricPayload.put("timestamp", timestamp)
                val metricPayloads = JSONArray()
                metricPayloads.put(metricPayload)
                metricJson.put("payload", metricPayloads)
                log("MY_PACKAGE_REPLACED", mapOf("metricJson" to metricJson.toString()))
                val body: RequestBody = RequestBody.create(MediaType.parse("text/plain"), metricJson.toString())

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
                            log("MY_PACKAGE_REPLACED", mapOf("response" to response.isSuccessful))
                            if (!response.isSuccessful) throw IOException("Unexpected code $response")
                        }
                    }
                })
            }
    }


}