package app.covidshield.services.metrics

import okhttp3.*

enum class MetricsPusherResult {
    Success, Error
}

interface MetricsPusher {
    fun push(jsonAsString: String): MetricsPusherResult
}

class DefaultMetricsPusher(private val apiEndpointUrl: String, private val apiEndpointKey: String) : MetricsPusher {

    private val okHttpClient by lazy { OkHttpClient() }

    override fun push(jsonAsString: String): MetricsPusherResult {
        val body: RequestBody = RequestBody.create(MediaType.parse("application/json"), jsonAsString)

        val request = Request.Builder()
                .url(apiEndpointUrl)
                .header("Accept", "application/json")
                .addHeader("Content-Type", "application/json")
                .addHeader("x-api-key", apiEndpointKey)
                .cacheControl(CacheControl.Builder().noStore().build())
                .post(body)
                .build()

        return okHttpClient.newCall(request).execute().use { response ->
            if (response.isSuccessful) MetricsPusherResult.Success else MetricsPusherResult.Error
        }
    }

}