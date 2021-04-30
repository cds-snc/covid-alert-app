package app.covidshield.services.metrics

import com.google.gson.Gson

interface MetricsJsonSerializer {
    fun serializeToJson(timestamp: Number, metrics: List<Metric>): String
}

class DefaultMetricsJsonSerializer(
        private val appVersion: String,
        private val appOs: String,
        private val osVersion: String,
        private val manufacturer: String,
        private val model: String,
        private val androidReleaseVersion: String) : MetricsJsonSerializer {

    override fun serializeToJson(timestamp: Number, metrics: List<Metric>): String {
        val jsonStructure = mapOf<String, Any>(
                "metricstimestamp" to timestamp,
                "appversion" to appVersion,
                "appos" to appOs,
                "osversion" to osVersion,
                "manufacturer" to manufacturer,
                "model" to model,
                "androidreleaseversion" to androidReleaseVersion,
                "payload" to metrics.map { metric ->
                    mapOf<String, Any>(
                            "identifier" to metric.identifier,
                            "region" to metric.region,
                            "timestamp" to metric.timestamp
                    ) + metric.payload
                }
        )
        return Gson().toJson(jsonStructure)
    }

}