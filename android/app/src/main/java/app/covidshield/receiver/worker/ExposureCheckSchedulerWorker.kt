package app.covidshield.receiver.worker

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import app.covidshield.extensions.log
import app.covidshield.models.ExposureStatus
import app.covidshield.services.metrics.MetricType
import app.covidshield.services.metrics.FilteredMetricsService
import app.covidshield.services.storage.StorageDirectory
import app.covidshield.services.storage.StorageService
import app.covidshield.utils.DateUtils
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatus
import com.google.gson.Gson
import kotlinx.coroutines.*
import kotlinx.coroutines.tasks.await

private const val HEADLESS_JS_TASK_NAME = "EXPOSURE_CHECK_HEADLESS_TASK"
private const val HEADLESS_JS_TASK_TIMEOUT_MS = 60000L

class ExposureCheckSchedulerWorker (val context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context)
    }

    private val storageService: StorageService by lazy {
        StorageService.getInstance(context)
    }

    override suspend fun doWork(): Result {
        Log.d("background", "ExposureCheckSchedulerWorker - doWork")

        val filteredMetricsService = FilteredMetricsService.getInstance(context)

        filteredMetricsService.addMetric(MetricType.ActiveUser, true)

        filteredMetricsService.sendDailyMetrics()

        filteredMetricsService.addMetric(MetricType.ScheduledCheckStartedToday, true)

        try {
            val status = storageService.retrieve(StorageDirectory.ExposureStatus)
            val exposureStatus = Gson().fromJson(status, ExposureStatus::class.java)
            val minutesSinceLastCheck = (DateUtils.getCurrentLocalDate().time - exposureStatus.lastChecked.timestamp) / 1000 / 60
            val backgroundCheck = storageService.retrieve(StorageDirectory.MetricsFilterStateStorageBackgroundCheckEventMarkerKey)?.split(",")?.count() ?: 0
            Log.d("background", "LastChecked: $minutesSinceLastCheck, BackgroundCheck: $backgroundCheck")
            filteredMetricsService.addDebugMetric(2.0, "LastChecked: $minutesSinceLastCheck, BackgroundCheck: $backgroundCheck")
        } catch (exception: Exception) {
            Log.e("exception", exception.message ?: "Exception message not available")
            filteredMetricsService.addDebugMetric(2.0, "LastChecked: n/a, BackgroundCheck: n/a")
        }

        try {
            val enIsEnabled = exposureNotificationClient.isEnabled.await()
            val enStatus = exposureNotificationClient.status.await()

            if (!enIsEnabled || enStatus.contains(ExposureNotificationStatus.INACTIVATED)) {
                filteredMetricsService.addDebugMetric(200.1, oncePerUTCDay = true)
                Log.d("background", "ExposureCheckSchedulerWorker - ExposureNotification: Not enabled or not activated")
                filteredMetricsService.addDebugMetric(2.1, "ExposureNotification: enIsEnabled = $enIsEnabled AND enStatus = ${enStatus.map { it.ordinal }}.")
                return Result.success()
            }
            val currentReactContext = getCurrentReactContext(context)
            if (currentReactContext != null) {
                filteredMetricsService.addDebugMetric(3.1)
                currentReactContext.getJSModule(RCTNativeAppEventEmitter::class.java)?.emit("initiateExposureCheckEvent", "data")
            } else {
                try {
                    withTimeout(HEADLESS_JS_TASK_TIMEOUT_MS) {
                        withContext(Dispatchers.Main) {
                            filteredMetricsService.addDebugMetric(3.2)
                            val completer = CompletableDeferred<Unit>()
                            CustomHeadlessTask(applicationContext, HEADLESS_JS_TASK_NAME) { completer.complete(Unit) }
                            completer.await()
                        }
                    }
                } catch (exception: TimeoutCancellationException) {
                    filteredMetricsService.addDebugMetric(101.0, exception.message ?: "Unknown")
                    log("doWork exception", mapOf("message" to "Timeout"))
                    return Result.success()
                } catch (exception: Exception) {
                    filteredMetricsService.addDebugMetric(102.0, exception.message ?: "Unknown")
                    log("doWork exception", mapOf("message" to (exception.message ?: "Unknown")))
                    return Result.success()
                }
            }
        } catch (exception: Exception) {
            filteredMetricsService.addDebugMetric(103.0, exception.message ?: "Unknown")
            Log.d("exception", "exception")
            return Result.success()
        }

        return Result.success()

    }

    private class CustomHeadlessTask(
            context: Context,
            taskId: String,
            private val onComplete: () -> Unit
    ) : ExposureCheckHeadlessTask(context, taskId) {

        override fun onHeadlessJsTaskStart(taskId: Int) {
            super.onHeadlessJsTaskStart(taskId)
            log("onExposureCheckHeadlessJsTaskStart")
        }

        override fun onHeadlessJsTaskFinish(taskId: Int) {
            super.onHeadlessJsTaskFinish(taskId)
            log("onExposureCheckHeadlessJsTaskFinish")
            onComplete()
        }
    }

    companion object {

        fun getCurrentReactContext(context: Context): ReactContext? {
            return try {
                val reactApplication = context.applicationContext as ReactApplication
                Log.d("background", "reactApplication - $reactApplication")
                val reactNativeHost = reactApplication.reactNativeHost
                Log.d("background", "reactNativeHost - $reactNativeHost")
                val reactInstanceManager = reactNativeHost.reactInstanceManager
                Log.d("background", "reactInstanceManager - $reactInstanceManager")
                val currentReactContext = reactInstanceManager.currentReactContext
                Log.d("background", "currentReactContext - $currentReactContext")
                currentReactContext
            } catch (_: Exception) {
                null
            }
        }
    }
}
