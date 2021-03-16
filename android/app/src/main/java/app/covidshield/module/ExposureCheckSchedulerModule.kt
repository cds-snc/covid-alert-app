package app.covidshield.module

import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.*
import androidx.work.PeriodicWorkRequest.MIN_PERIODIC_FLEX_MILLIS
import androidx.work.PeriodicWorkRequest.MIN_PERIODIC_INTERVAL_MILLIS
import app.covidshield.extensions.parse
import app.covidshield.extensions.toJson
import app.covidshield.receiver.worker.ExposureCheckNotificationWorker
import app.covidshield.receiver.worker.ExposureCheckSchedulerWorker
import app.covidshield.services.metrics.MetricsService
import com.facebook.react.bridge.*
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import java.util.concurrent.TimeUnit
import kotlin.coroutines.CoroutineContext

class ExposureCheckSchedulerModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    override fun getName(): String = "ExposureCheckScheduler"

    override val coroutineContext: CoroutineContext get() = Dispatchers.Default

    private val workManager: WorkManager by lazy(LazyThreadSafetyMode.NONE) {
        WorkManager.getInstance(context.applicationContext)
    }

    private val workerConstraints = Constraints.Builder()
            .setRequiresCharging(false)
            .setRequiresBatteryNotLow(false)
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

    @ReactMethod
    fun scheduleExposureCheck(data: ReadableMap, promise: Promise) {
        Log.d("background", "scheduleExposureCheck")

        MetricsService.publishDebugMetric(1.0, context);

        val config = data.toHashMap().toJson().parse(PeriodicWorkPayload::class.java)
        Log.d("Minimum Repeat Interval", MIN_PERIODIC_INTERVAL_MILLIS.toString())
        Log.d("Config Repeat Interval", config.repeatInterval.toString())
        Log.d("Minimum Flex Time", MIN_PERIODIC_FLEX_MILLIS.toString())
        val workerRequest: PeriodicWorkRequest = PeriodicWorkRequestBuilder<ExposureCheckSchedulerWorker>(config.repeatInterval, TimeUnit.MILLISECONDS)
                .setInitialDelay(config.initialDelay, TimeUnit.MINUTES)
                .setConstraints(workerConstraints)
                .build()

        workManager.enqueueUniquePeriodicWork("exposureCheckSchedulerWorker", ExistingPeriodicWorkPolicy.REPLACE, workerRequest)
    }

    @ReactMethod
    fun executeExposureCheck(data: ReadableMap, promise: Promise) {
        Log.d("background", "executeExposureCheck")

        MetricsService.publishDebugMetric(7.0, context);

        val config = data.toHashMap().toJson().parse(NotificationPayload::class.java)

        val workerData = Data.Builder()
                .putString("title", config.title)
                .putString("body", config.body)
                .putString("channelName", config.channelName)
                .putBoolean("disableSound", config.disableSound)
                .build()

        val workerRequest: OneTimeWorkRequest = OneTimeWorkRequestBuilder<ExposureCheckNotificationWorker>()
                .setInputData(workerData)
                .setConstraints(workerConstraints)
                .build()

        workManager.enqueueUniqueWork("exposureCheckNotificationWorker", ExistingWorkPolicy.REPLACE, workerRequest)
    }

}


private class PeriodicWorkPayload(
        @SerializedName("repeatInterval") val _repeatInterval: Long?,
        @SerializedName("initialDelay") val _initialDelay: Long?
) {
    val repeatInterval get() = if (_repeatInterval != null) {
        val repeatIntervalMillis = TimeUnit.MINUTES.toMillis(_repeatInterval)
        if (repeatIntervalMillis > MIN_PERIODIC_INTERVAL_MILLIS) {
            repeatIntervalMillis
        } else {
            MIN_PERIODIC_INTERVAL_MILLIS
        }
    } else {
        0
    }

    val initialDelay get() = _initialDelay?: 0
}


private class NotificationPayload(
        @SerializedName("uuid") private val _uuid: String?,
        @SerializedName("alertAction") val action: String?,
        @SerializedName("alertBody") val body: String?,
        @SerializedName("alertTitle") val title: String?,
        @SerializedName("channelName") val channelName: String?,
        @SerializedName("priority") val _priority: Int?,
        @SerializedName("disableSound") val _disableSound: Boolean?

) {

    val uuid get() = _uuid ?: "app.covidshield.exposure-notification"

    val priority get() = _priority ?: NotificationCompat.PRIORITY_MAX

    val disableSound get() = _disableSound?: false

}