package app.covidshield.services.metrics

import android.content.Context
import android.util.Log
import app.covidshield.BuildConfig
import app.covidshield.services.storage.StorageDirectory
import app.covidshield.services.storage.StorageService
import app.covidshield.utils.DateUtils
import java.util.*

interface FutureMetricsService {
    suspend fun publishMetric(metric: Metric, forcePush: Boolean = false)
    suspend fun sendDailyMetrics()
}

private enum class TriggerPushResult {
    Success, Error, NoData
}

class DefaultFutureMetricsService private constructor(
        private val storageService: StorageService,
        private val metricsPublisher: MetricsPublisher,
        private val metricsProvider: MetricsProvider,
        private val metricsStorageCleaner: MetricsStorageCleaner,
        private val metricsJsonSerializer: MetricsJsonSerializer,
        private val metricsPusher: MetricsPusher) : FutureMetricsService {

    companion object {

        fun initialize(metricsJsonSerializer: MetricsJsonSerializer, context: Context): FutureMetricsService {
            val storageService = StorageService.getInstance(context)
            val metricsStorage = DefaultMetricsStorage(storageService)
            val metricsPublisher = DefaultMetricsPublisher(metricsStorage)
            val metricsProvider = DefaultMetricsProvider(metricsStorage)
            val metricsPusher = DefaultMetricsPusher(BuildConfig.METRICS_URL, BuildConfig.METRICS_API_KEY)
            return DefaultFutureMetricsService(
                    storageService,
                    metricsPublisher,
                    metricsProvider,
                    metricsStorage,
                    metricsJsonSerializer,
                    metricsPusher
            )
        }

    }

    override suspend fun publishMetric(metric: Metric, forcePush: Boolean) {
        metricsPublisher.publish(listOf(metric))
        if (forcePush) triggerPush()
    }

    override suspend fun sendDailyMetrics() {

        suspend fun pushAndMarkLastUploadedDateTime() {
            triggerPush().let { result ->
                if (result == TriggerPushResult.Success) {
                    markMetricsLastUploadedDateTime(DateUtils.getCurrentUTCDate())
                }
            }
        }

        return getMetricsLastUploadedDateTime()?.let { date ->
            if (!DateUtils.isSameDay(date, DateUtils.getCurrentUTCDate())) {
                pushAndMarkLastUploadedDateTime()
            }
        } ?: pushAndMarkLastUploadedDateTime()
    }

    private suspend fun triggerPush(): TriggerPushResult {

        suspend fun pushAndClearMetrics(metrics: List<Metric>): TriggerPushResult {
            val jsonAsString = metricsJsonSerializer.serializeToJson(DateUtils.getCurrentLocalDate().time, metrics)
            return metricsPusher.push(jsonAsString)?.let {
                when (it) {
                    MetricsPusherResult.Success -> {
                        val lastPushedMetricTimestamp = metrics.last().timestamp
                        markLastMetricTimestampSentToTheServer(lastPushedMetricTimestamp)
                        metricsStorageCleaner.deleteUntilTimestamp(lastPushedMetricTimestamp)
                        TriggerPushResult.Success
                    }
                    MetricsPusherResult.Error -> TriggerPushResult.Error
                }
            }
        }

        val metricsToPush = getLastMetricTimestampSentToTheServer()?.let { timestamp ->
            metricsProvider.retrieveLaterThanTimestamp(timestamp)
        } ?: metricsProvider.retrieveAll()

        return if (metricsToPush.isNotEmpty()) {
            pushAndClearMetrics(metricsToPush)
        } else {
            TriggerPushResult.NoData
        }
    }

    private suspend fun getLastMetricTimestampSentToTheServer(): Number? {
        return storageService.retrieve(StorageDirectory.KotlinMetricsServiceLastMetricTimestampSentToTheServerKey)?.toLong()
    }

    private suspend fun markLastMetricTimestampSentToTheServer(timestamp: Number) {
        storageService.save(StorageDirectory.KotlinMetricsServiceLastMetricTimestampSentToTheServerKey, timestamp.toString())
    }

    private suspend fun getMetricsLastUploadedDateTime(): Date? {
        return storageService.retrieve(StorageDirectory.KotlinMetricsServiceMetricsLastUploadedDateTimeKey)?.let { Date(it.toLong()) }
    }

    private suspend fun markMetricsLastUploadedDateTime(date: Date) {
        storageService.save(StorageDirectory.KotlinMetricsServiceMetricsLastUploadedDateTimeKey, date.time.toString())
    }

}