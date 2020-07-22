package app.covidshield.module

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat.getSystemService
import app.covidshield.MainActivity
import app.covidshield.R
import app.covidshield.extensions.launch
import app.covidshield.extensions.parse
import app.covidshield.extensions.toJson
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.CoroutineContext

private const val CHANNEL_ID = "COVID Alert"
private const val CHANNEL_NAME = "COVID Alert"
private const val CHANNEL_DESC = "COVID Alert"

/**
 * See https://developer.android.com/training/notify-user/build-notification#kotlin
 */
class PushNotificationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    private val notificationManager = NotificationManagerCompat.from(context)

    init {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = CHANNEL_NAME
            val descriptionText = CHANNEL_DESC
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager = getSystemService(context, NotificationManager::class.java) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
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
            showNotification(config)
            promise.resolve(null)
        }
    }

    private fun showNotification(config: PushNotificationConfig) {
        val context = reactApplicationContext.applicationContext
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(context, 0, intent, 0)

        val builder = NotificationCompat.Builder(reactApplicationContext, CHANNEL_NAME)
            .setSmallIcon(R.drawable.ic_notification_icon)
            .setContentTitle(config.title)
            .setContentText(config.body)
            .setPriority(config.priority)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
        notificationManager.notify(config.uuid.hashCode(), builder.build())
    }
}

private class PushNotificationConfig(
    @SerializedName("uuid") private val _uuid: String?,
    @SerializedName("alertAction") val action: String?,
    @SerializedName("alertBody") val body: String?,
    @SerializedName("alertTitle") val title: String?,
    @SerializedName("priority") val _priority: Int?
) {

    val uuid get() = _uuid ?: "app.covidshield.exposure-notification"

    val priority get() = _priority ?: NotificationCompat.PRIORITY_MAX
}