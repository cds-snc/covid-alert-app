package app.covidshield.services.metrics

interface MetricsPublisher {
    suspend fun publish(metrics: List<Metric>)
}

class DefaultMetricsPublisher(private val metricsStorage: MetricsStorageWriter) : MetricsPublisher {

    override suspend fun publish(metrics: List<Metric>) {
        metricsStorage.save(metrics)
    }

}