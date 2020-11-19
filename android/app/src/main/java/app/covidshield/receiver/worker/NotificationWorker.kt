package app.covidshield.receiver.worker

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import app.covidshield.MainActivity
import app.covidshield.R
import app.covidshield.extensions.log

class NotificationWorker(private val context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    override suspend fun doWork(): Result {
        // val intent = Intent()
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(context, 0, intent, 0)
        val newMessageNotification = NotificationCompat.Builder(context, "COVID Alert")
                .setSmallIcon(inputData.getInt("smallIcon", R.drawable.ic_notification_icon))
                .setContentTitle(inputData.getString("title"))
                .setContentText(inputData.getString("body"))
                .setStyle(NotificationCompat.BigTextStyle().bigText(inputData.getString("body")))
                .setPriority(inputData.getInt("priority", NotificationCompat.PRIORITY_DEFAULT))
                .setContentIntent(pendingIntent)

        val notificationManager: NotificationManager = context.applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Issue the notification.
        with(NotificationManagerCompat.from(context)) {
            notificationManager.notify(inputData.getString("uuid").hashCode(), newMessageNotification.build())
        }
        return Result.success()
    }
}