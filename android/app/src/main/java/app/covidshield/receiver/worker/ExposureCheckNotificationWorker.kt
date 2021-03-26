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
import app.covidshield.services.metrics.MetricsService
import com.facebook.react.ReactApplication
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.tasks.await


class ExposureCheckNotificationWorker (private val context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    private val notificationManager: NotificationManager = context.applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context)
    }

    override suspend fun doWork(): Result {

        Log.d("background", "ExposureCheckNotificationWorker - doWork")

        val enIsEnabled = exposureNotificationClient.isEnabled.await()
        val enStatus = exposureNotificationClient.status.await()
        if (!enIsEnabled || enStatus.contains(ExposureNotificationStatus.INACTIVATED)) {
            MetricsService.publishDebugMetric(5.1, context)
            Log.d("background", "ExposureCheckNotificationWorker - ExposureNotification: Not enabled or not activated")
            return Result.success()
        }

        val reactApplication = applicationContext as? ReactApplication ?: return Result.success()
        MetricsService.publishDebugMetric(5.2, context)
        val reactInstanceManager = reactApplication.reactNativeHost.reactInstanceManager
        reactInstanceManager.currentReactContext?.getJSModule(RCTNativeAppEventEmitter::class.java)?.emit("executeExposureCheckEvent", "data")

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

        // TODO: How long should the notification appear?
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

    companion object {
        // A randomly generated constant.
        // If either the channel importance / priority or the sound are changed,
        // then CHANNEL_ID also needs to be changed.
        private const val CHANNEL_ID = "NVYJYRQYOM"
    }

}