package app.covidshield.receiver.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import app.covidshield.extensions.log
import app.covidshield.receiver.ExposureNotificationBroadcastReceiver
import com.facebook.react.ReactApplication
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient.EXTRA_TOKEN

class StateUpdatedWorker(
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        val token = params.inputData.getString(EXTRA_TOKEN)!!
        val reactApplication = applicationContext as? ReactApplication ?: return Result.success()
        val reactInstanceManager = reactApplication.reactNativeHost.reactInstanceManager

        log("StateUpdatedWorker", mapOf("token" to token))

        reactInstanceManager.packages.mapNotNull { it as? ExposureNotificationBroadcastReceiver.Helper }.forEach { it.onReceive(token) }
        return Result.success()
    }
}