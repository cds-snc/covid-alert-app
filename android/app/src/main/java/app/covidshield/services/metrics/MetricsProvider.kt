package app.covidshield.services.metrics

interface MetricsProvider {
    suspend fun retrieveAll(): List<Metric>
    suspend fun retrieveLaterThanTimestamp(timestamp: Number): List<Metric>
}

class DefaultMetricsProvider(private val metricsStorage: MetricsStorageReader) : MetricsProvider {

    override suspend fun retrieveAll(): List<Metric> {
        return metricsStorage.retrieve()
    }

    override suspend fun retrieveLaterThanTimestamp(timestamp: Number): List<Metric> {
        return retrieveAll().filter { it.timestamp.toLong() > timestamp.toLong() }
    }

}