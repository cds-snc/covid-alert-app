package app.covidshield.receiver.worker

import android.annotation.TargetApi
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.text.Html
import android.text.Spanned
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.ForegroundInfo
import androidx.work.WorkerParameters
import app.covidshield.MainActivity
import app.covidshield.R
import app.covidshield.extensions.log
import app.covidshield.services.metrics.FilteredMetricsService
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatus
import kotlinx.coroutines.*
import kotlinx.coroutines.tasks.await
import java.lang.Exception

private const val HEADLESS_JS_TASK_NAME = "EXPOSURE_NOTIFICATION_HEADLESS_TASK"
private const val HEADLESS_JS_TASK_TIMEOUT_MS = 60000L

class ExposureCheckNotificationWorker (private val context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    private val notificationManager: NotificationManager = context.applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context)
    }

    private val filteredMetricsService by lazy {
        FilteredMetricsService.getInstance(context)
    }

    override suspend fun doWork(): Result {

        Log.d("background", "ExposureCheckNotificationWorker - doWork")

        try {
            withTimeout(HEADLESS_JS_TASK_TIMEOUT_MS) {
                val intent = Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                }

                val pendingIntent = PendingIntent.getActivity(context, 0, intent, 0)
                val notification = NotificationCompat.Builder(context, "1")
                        .setSmallIcon(inputData.getInt("smallIcon", R.drawable.ic_detect_icon))
                        .setContentTitle(inputData.getString("title"))
                        .setContentText(inputData.getString("body"))
                        .setContentIntent(pendingIntent)
                        .setOngoing(true)

                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                    notification.setPriority(inputData.getInt("priority", NotificationCompat.PRIORITY_DEFAULT))
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    createNotificationChannel(CHANNEL_ID, inputData.getString("channelName")?: "COVID Alert Exposure Checks", inputData.getBoolean("disableSound", false))
                    notification.setChannelId(CHANNEL_ID)
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    val styledText: Spanned = Html.fromHtml(inputData.getString("body"), Html.FROM_HTML_MODE_LEGACY)
                    notification.setStyle(NotificationCompat.BigTextStyle().bigText(styledText))
                }

                val foregroundInfo = ForegroundInfo(1, notification.build())
                setForeground(foregroundInfo)

                val enIsEnabled = exposureNotificationClient.isEnabled.await()
                val enStatus = exposureNotificationClient.status.await()
                if (!enIsEnabled || enStatus.contains(ExposureNotificationStatus.INACTIVATED)) {
                    filteredMetricsService.addDebugMetric(200.2, oncePerUTCDay = true)
                    Log.d("background", "ExposureCheckNotificationWorker - ExposureNotification: Not enabled or not activated")
                    filteredMetricsService.addDebugMetric(7.1, "ExposureNotification: enIsEnabled = $enIsEnabled AND enStatus = ${enStatus.map { it.ordinal }}.")
                }

                val currentReactContext = getCurrentReactContext(context)
                if (currentReactContext != null) {
                    currentReactContext.getJSModule(RCTNativeAppEventEmitter::class.java)?.emit("executeExposureCheckEvent", "data")
                } else {
                    withContext(Dispatchers.Main) {
                        filteredMetricsService.addDebugMetric(3.3)
                        val completer = CompletableDeferred<Unit>()
                        CustomHeadlessTask(applicationContext, HEADLESS_JS_TASK_NAME) { completer.complete(Unit) }
                        completer.await()
                    }
                }
            }
        } catch (exception: TimeoutCancellationException) {
            filteredMetricsService.addDebugMetric(111.0, exception.message ?: "Unknown")
            log("doWork exception", mapOf("message" to "Timeout"))
            return Result.success()
        } catch (exception: Exception) {
            filteredMetricsService.addDebugMetric(112.0, exception.message ?: "Unknown")
            log("doWork exception", mapOf("message" to (exception.message ?: "Unknown")))
            return Result.success()
        }

        // Without this delay, the notification will not appear
        delay(5000)
        return Result.success()
    }

    /**
     * Create the required notification channel for O+ devices.
     */
    @TargetApi(Build.VERSION_CODES.O)
    private fun createNotificationChannel(
            channelId: String,
            name: String,
            disableSound: Boolean
    ): NotificationChannel {
        return NotificationChannel(
                channelId, name, NotificationManager.IMPORTANCE_DEFAULT
        ).also { channel ->
            if (disableSound) {
                channel.setSound(null, null)
            }
            notificationManager.createNotificationChannel(channel)
        }
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
        // A randomly generated constant.
        // If either the channel importance / priority or the sound are changed,
        // then CHANNEL_ID also needs to be changed.
        private const val CHANNEL_ID = "NVYJYRQYOM"

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