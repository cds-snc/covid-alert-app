package app.covidshield.module

import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.*
import app.covidshield.R
import app.covidshield.extensions.parse
import app.covidshield.extensions.toJson
import app.covidshield.receiver.worker.ExposureCheckWorker
import app.covidshield.receiver.worker.NotificationWorker
import com.facebook.react.bridge.*
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import java.util.concurrent.TimeUnit
import kotlin.coroutines.CoroutineContext

class ExposureCheckModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    init {

    }

    override fun getName(): String = "ExposureCheck"

    private val workManager: WorkManager by lazy(LazyThreadSafetyMode.NONE) {
        WorkManager.getInstance(context.applicationContext)
    }

    override val coroutineContext: CoroutineContext get() = Dispatchers.Default

    @ReactMethod
    fun scheduleExposureCheck(data: ReadableMap, promise: Promise) {

        val config = data.toHashMap().toJson().parse(ExposureCheckConfig::class.java)
        val workerData = Data.Builder()
                .putString("title", config.title)
                .putString("body", config.body)
                .putBoolean("disableSound", config.disableSound)
                .build()

        val workerConstraints = Constraints.Builder()
                .setRequiresCharging(false)
                .setRequiresBatteryNotLow(false)
                .build()

        val workerRequest: PeriodicWorkRequest = PeriodicWorkRequestBuilder<ExposureCheckWorker>(config.repeatInterval, TimeUnit.MINUTES)
                .setInitialDelay(config.initialDelay, TimeUnit.MINUTES)
                .setInputData(workerData)
                .setConstraints(workerConstraints)
                .build()

        workManager.enqueueUniquePeriodicWork("exposureCheckWorker", ExistingPeriodicWorkPolicy.REPLACE, workerRequest)
    }

}


private class ExposureCheckConfig(
        @SerializedName("uuid") private val _uuid: String?,
        @SerializedName("alertAction") val action: String?,
        @SerializedName("alertBody") val body: String?,
        @SerializedName("alertTitle") val title: String?,
        @SerializedName("priority") val _priority: Int?,
        @SerializedName("repeatInterval") val _repeatInterval: Long?,
        @SerializedName("initialDelay") val _initialDelay: Long?,
        @SerializedName("disableSound") val _disableSound: Boolean?
) {

    val uuid get() = _uuid ?: "app.covidshield.exposure-notification"

    val priority get() = _priority ?: NotificationCompat.PRIORITY_MAX

    val repeatInterval get() = if (_repeatInterval != null) {
        if (_repeatInterval > PeriodicWorkRequest.MIN_PERIODIC_INTERVAL_MILLIS) _repeatInterval else PeriodicWorkRequest.MIN_PERIODIC_INTERVAL_MILLIS
    } else {
        0
    }

    val initialDelay get() = _initialDelay?: 0

    val disableSound get() = _disableSound?: false

}