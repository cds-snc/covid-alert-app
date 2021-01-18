package app.covidshield.module

import android.annotation.TargetApi
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.*
import app.covidshield.MainActivity
import app.covidshield.R
import app.covidshield.extensions.launch
import app.covidshield.extensions.parse
import app.covidshield.extensions.toJson
import app.covidshield.receiver.worker.NotificationWorker
import com.facebook.react.bridge.*
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import java.util.concurrent.TimeUnit
import kotlin.coroutines.CoroutineContext

private const val CHANNEL_DESC = "COVID Alert"

/**
 * See https://developer.android.com/training/notify-user/build-notification#kotlin
 */
class PushNotificationModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    private val notificationManager: NotificationManager by lazy(LazyThreadSafetyMode.NONE) {
        context.applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    }

    private val workManager: WorkManager by lazy(LazyThreadSafetyMode.NONE) {
        WorkManager.getInstance(context.applicationContext)
    }

    override fun getName(): String = "PushNotification"

    override val coroutineContext: CoroutineContext get() = Dispatchers.Default

    @ReactMethod
    fun requestPermissions(config: ReadableMap, promise: Promise) {
        // Noop for Android
        promise.resolve(null)
    }

    @ReactMethod
    fun presentLocalNotification(data: ReadableMap, promise: Promise) {
        promise.launch(this) {
            val config = data.toHashMap().toJson().parse(PushNotificationConfig::class.java)
            if (config.repeatInterval > 0){
                delayNotification(config)
                promise.resolve(null)
            } else {
                showNotification(config)
                promise.resolve(null)
            }
        }
    }

    private fun showNotification(config: PushNotificationConfig) {
        val context = reactApplicationContext.applicationContext
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(context, 0, intent, 0)

        val builder = NotificationCompat.Builder(reactApplicationContext, config.channelName)
            .setSmallIcon(R.drawable.ic_notification_icon)
            .setContentTitle(config.title)
            .setContentText(config.body)
            .setPriority(config.priority)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            builder.setPriority(config.priority)
            builder.setVibrate(longArrayOf(0));
        } else {
            builder.setChannelId(CHANNEL_ID)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel(
                    CHANNEL_ID, config.channelName, NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESC
            }.also { channel ->
                // delete old channels as new ones are created with random channel IDs
                notificationManager.deleteNotificationChannel("COVID Alert")
                notificationManager.createNotificationChannel(channel)
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            builder.setStyle(NotificationCompat.BigTextStyle().bigText(config.body))
        }

        notificationManager.notify(config.uuid.hashCode(), builder.build())
    }

    private fun delayNotification(config: PushNotificationConfig) {
        Log.d("CovidAlert", "MIN_PERIODIC_INTERVAL_MILLIS: ${PeriodicWorkRequest.MIN_PERIODIC_INTERVAL_MILLIS}")
        Log.d("CovidAlert", "REPEAT INTERVAL: ${config.repeatInterval}")
        Log.d("CovidAlert", "MIN_PERIODIC_FLEX_MILLIS: ${PeriodicWorkRequest.MIN_PERIODIC_FLEX_MILLIS}")

        val notificationData = Data.Builder()
                .putString("uuid", config.uuid)
                .putInt("smallIcon", R.drawable.ic_notification_icon)
                .putString("title", config.title)
                .putString("body", config.body)
                .putInt("priority", config.priority)
                .putBoolean("disableSound", config.disableSound)
                .build()

        val notificationConstraints: Constraints = Constraints.Builder()
                .setRequiresCharging(false)
                .setRequiresBatteryNotLow(false)
                .build()

        val notificationWorkerRequest: PeriodicWorkRequest = PeriodicWorkRequestBuilder<NotificationWorker>(config.repeatInterval, TimeUnit.MILLISECONDS)
                .setInitialDelay(config.initialDelay, TimeUnit.MINUTES)
                .setInputData(notificationData)
                .setConstraints(notificationConstraints)
                .build()

        workManager.enqueueUniquePeriodicWork("notificationReminder", ExistingPeriodicWorkPolicy.REPLACE, notificationWorkerRequest)
    }

    companion object {
        // A randomly generated constant.
        // If either the channel importance / priority or the sound are changed,
        // then CHANNEL_ID also needs to be changed.
        private const val CHANNEL_ID = "LMFWEBMADK"
    }
}

private class PushNotificationConfig(
    @SerializedName("uuid") private val _uuid: String?,
    @SerializedName("alertAction") val action: String?,
    @SerializedName("alertBody") val body: String?,
    @SerializedName("alertTitle") val title: String?,
    @SerializedName("priority") val _priority: Int?,
    @SerializedName("repeatInterval") val _repeatInterval: Long?,
    @SerializedName("initialDelay") val _initialDelay: Long?,
    @SerializedName("disableSound") val _disableSound: Boolean?,
    @SerializedName("channelName") val channelName: String
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
