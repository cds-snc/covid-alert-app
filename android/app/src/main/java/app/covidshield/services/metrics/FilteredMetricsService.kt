package app.covidshield.services.metrics

import android.content.Context
import app.covidshield.BuildConfig
import app.covidshield.utils.DateUtils
import app.covidshield.utils.SingletonHolder
import kotlinx.coroutines.runBlocking

enum class MetricType(val identifier: String, val shouldBePushedToServerRightAway: Boolean) {
    PackageUpdated("android-package-replaced", false),
    ScheduledCheckStartedToday("scheduled-check-started-today", false),
    ScheduledCheckSuccessfulToday("scheduled-check-successful-today", false),
    ActiveUser("active-user", true)
}

interface FilteredMetricsService {

    companion object : SingletonHolder<FilteredMetricsService, Context>(::DefaultFilteredMetricsService)

    suspend fun addMetric(metricType: MetricType, oncePerUTCDay: Boolean)
    suspend fun addDebugMetric(stepNumber: Double, message: String = "n/a", oncePerUTCDay: Boolean = false)
    suspend fun sendDailyMetrics()

}

class DefaultFilteredMetricsService constructor(private val context: Context) : FilteredMetricsService {

    private val metricsService = DefaultMetricsService.initialize(
            DefaultMetricsJsonSerializer(
                    context.packageManager.getPackageInfo(context.packageName, 0).versionName,
                    "android",
                    android.os.Build.VERSION.SDK_INT.toString(),
                    android.os.Build.MANUFACTURER,
                    android.os.Build.MODEL,
                    android.os.Build.VERSION.RELEASE
            ),
            context
    )

    override suspend fun addMetric(metricType: MetricType, oncePerUTCDay: Boolean) {

        suspend fun pushMetric() {
            val metric = Metric(DateUtils.getCurrentLocalDate().time, metricType.identifier, "None", emptyMap())
            metricsService.publishMetric(metric, metricType.shouldBePushedToServerRightAway)
        }

        if (oncePerUTCDay) {
            if (UniqueDailyMetricsHelper.canPublishMetric(metricType.identifier, context)) {
                pushMetric()
                UniqueDailyMetricsHelper.markMetricAsPublished(metricType.identifier, context)
            }
        } else {
            pushMetric()
        }
    }

    override suspend fun addDebugMetric(stepNumber: Double, message: String, oncePerUTCDay: Boolean) {

        if (!DebugMetricsHelper.canPublishDebugMetrics(context)) return

        suspend fun pushMetric() {
            val lifecycleIdentifier = DebugMetricsHelper.getLifecycleIdentifier()
            val lifecycleDailyCount = DebugMetricsHelper.getLifecycleDailyCount(context)
            val successfulDailyBackgroundChecks = DebugMetricsHelper.getSuccessfulDailyBackgroundChecks(context)

            val payload = listOfNotNull(
                    "step" to stepNumber.toString(),
                    "lifecycleId" to lifecycleIdentifier,
                    "lifeCycleDailyCount" to lifecycleDailyCount.toString(),
                    "successfulDailyBackgroundChecks" to successfulDailyBackgroundChecks.toString(),
                    "message" to message,
                    if (BuildConfig.TEST_MODE == "true") "deviceIdentifier" to DebugMetricsHelper.getDeviceIdentifier(context) else null
            ).toMap()

            val metric = Metric(
                    DateUtils.getCurrentLocalDate().time,
                    "ExposureNotificationCheck",
                    "None",
                    payload
            )

            metricsService.publishMetric(metric)
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

    override suspend fun sendDailyMetrics() {
        metricsService.sendDailyMetrics()
    }

}

object JavaFilteredMetricsService {

    @JvmStatic
    @JvmOverloads
    fun addDebugMetric(filteredMetricsService: FilteredMetricsService, stepNumber: Double, message: String = "n/a", oncePerUTCDay: Boolean = false) {
        runBlocking {
            filteredMetricsService.addDebugMetric(stepNumber, message, oncePerUTCDay)
        }
    }

}