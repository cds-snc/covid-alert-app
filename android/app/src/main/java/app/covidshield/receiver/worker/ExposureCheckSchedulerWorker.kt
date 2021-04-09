package app.covidshield.receiver.worker

import android.content.Context
import android.content.res.Resources
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import app.covidshield.MainApplication
import app.covidshield.R
import app.covidshield.extensions.log
import app.covidshield.services.metrics.MetricsService
import app.covidshield.storage.StorageDirectory
import app.covidshield.storage.StorageService
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatus
import kotlinx.coroutines.*
import kotlinx.coroutines.tasks.await
import java.util.*

private const val HEADLESS_JS_TASK_NAME = "EXPOSURE_CHECK_HEADLESS_TASK"
private const val HEADLESS_JS_TASK_TIMEOUT_MS = 60000L

class ExposureCheckSchedulerWorker (val context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context)
    }

    override suspend fun doWork(): Result {
        Log.d("background", "ExposureCheckSchedulerWorker - doWork")

        val locale = StorageService.getInstance(context).retrieve(StorageDirectory.GlobalLocaleKey)

        if (locale != null) {
            val locale = when (locale) {
                "fr" -> Locale.CANADA_FRENCH
                else -> Locale.CANADA
            }

            Locale.setDefault(locale)
            val resources: Resources = MainApplication.instance.resources
            val config = resources.configuration
            config.setLocale(locale)
            resources.updateConfiguration(config, resources.displayMetrics)

            Log.d("DEBUG>>>", "App name = ${MainApplication.instance.resources.getString(R.string.app_name)}")
        }

        MetricsService.publishDebugMetric(2.0, context)

        try {
            val enIsEnabled = exposureNotificationClient.isEnabled.await()
            val enStatus = exposureNotificationClient.status.await()

            if (!enIsEnabled || enStatus.contains(ExposureNotificationStatus.INACTIVATED)) {
                Log.d("background", "ExposureCheckSchedulerWorker - ExposureNotification: Not enabled or not activated")
                MetricsService.publishDebugMetric(2.1, context, "ExposureNotification: enIsEnabled = $enIsEnabled AND enStatus = ${enStatus.map { it.ordinal }}.")
                return Result.success()
            }
            val currentReactContext = getCurrentReactContext(context)
            if (currentReactContext != null) {
                MetricsService.publishDebugMetric(3.1, context);
                currentReactContext.getJSModule(RCTNativeAppEventEmitter::class.java)?.emit("initiateExposureCheckEvent", "data")
            } else {
                try {
                    withTimeout(HEADLESS_JS_TASK_TIMEOUT_MS) {
                        withContext(Dispatchers.Main) {
                            MetricsService.publishDebugMetric(3.2, context);
                            val completer = CompletableDeferred<Unit>()
                            CustomHeadlessTask(applicationContext, HEADLESS_JS_TASK_NAME) { completer.complete(Unit) }
                            completer.await()
                        }
                    }
                } catch (_: TimeoutCancellationException) {
                    MetricsService.publishDebugMetric(101.0, context);
                    log("doWork exception", mapOf("message" to "Timeout"))
                } catch (exception: Exception) {
                    MetricsService.publishDebugMetric(102.0, context, exception.message ?: "Unknown");
                    log("doWork exception", mapOf("message" to (exception.message ?: "Unknown")))
                }
            }
        } catch (exception: Exception) {
            MetricsService.publishDebugMetric(103.0, context, exception.message ?: "Unknown");
            Log.d("exception", "exception")
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