package app.covidshield.services.metrics

import app.covidshield.services.storage.StorageDirectory
import app.covidshield.services.storage.StorageService
import com.google.gson.Gson

interface MetricsStorageReader {
    suspend fun retrieve(): List<Metric>
}

interface MetricsStorageWriter {
    suspend fun save(metrics: List<Metric>)
}

interface MetricsStorageCleaner {
    suspend fun deleteUntilTimestamp(timestamp: Number)
}

interface MetricsStorage : MetricsStorageReader, MetricsStorageWriter, MetricsStorageCleaner

class DefaultMetricsStorage(private val storageService: StorageService) : MetricsStorage {

    override suspend fun save(metrics: List<Metric>) {
        val existingMetrics = storageService.retrieve(StorageDirectory.KotlinMetricsStorageKey)
        val serializedMetrics = serializeNewMetrics(existingMetrics, metrics)
        storageService.save(StorageDirectory.KotlinMetricsStorageKey, serializedMetrics)
    }

    override suspend fun retrieve(): List<Metric> = storageService.retrieve(StorageDirectory.KotlinMetricsStorageKey)?.let { deserializeMetrics(it) } ?: emptyList()

    override suspend fun deleteUntilTimestamp(timestamp: Number) {
        val metrics = retrieve()
        val filteredMetrics = metrics.filter { it.timestamp.toLong() > timestamp.toLong() }
        val newSerializedMetrics = serializeNewMetrics(null, filteredMetrics)
        storageService.save(StorageDirectory.KotlinMetricsStorageKey, newSerializedMetrics)
    }

    private fun serializeNewMetrics(existingSerializedMetrics: String?, newMetrics: List<Metric>): String {
        return newMetrics.fold(existingSerializedMetrics ?: "") { acc, current ->
            val serializedMetric = "${current.timestamp};${current.identifier};${current.region};${Gson().toJson(current.payload)}"
            if (acc == "") serializedMetric else "$acc#$serializedMetric"
        }
    }

    private fun deserializeMetrics(serializedMetrics: String): List<Metric> {
        if (serializedMetrics.isNullOrBlank()) return emptyList()
        return serializedMetrics.split("#").map { metric ->
            val (timestamp, identifier, region, payload) = metric.split(";")
            val reconstructedPayload = Gson().fromJson<Map<String, String>>(payload, Map::class.java)
            Metric(timestamp.toLong(), identifier, region, reconstructedPayload)
        }
    }

}