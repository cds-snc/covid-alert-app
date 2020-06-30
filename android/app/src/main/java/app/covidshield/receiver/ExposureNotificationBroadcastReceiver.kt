package app.covidshield.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.work.CoroutineWorker
import androidx.work.Data
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import app.covidshield.extensions.log
import com.facebook.react.ReactApplication
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient.EXTRA_TOKEN

class ExposureNotificationBroadcastReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        log("onReceive", mapOf("action" to action))

        if (action != ExposureNotificationClient.ACTION_EXPOSURE_STATE_UPDATED) {
            return
        }

        val workManager: WorkManager = WorkManager.getInstance(context)
        val token = intent.getStringExtra(EXTRA_TOKEN)
        val inputData = Data.Builder()
            .putString(EXTRA_TOKEN, token)
            .build()
        log("onReceive", mapOf("token" to token))

        workManager.enqueue(
            OneTimeWorkRequest.Builder(StateUpdatedWorker::class.java)
                .setInputData(inputData)
                .build()
        )
    }

    class StateUpdatedWorker(
        appContext: Context,
        private val params: WorkerParameters
    ) : CoroutineWorker(appContext, params) {

        override suspend fun doWork(): Result {
            val token = params.inputData.getString(EXTRA_TOKEN)!!
            val reactApplication = applicationContext as? ReactApplication
                ?: return Result.success()
            val reactInstanceManager = reactApplication.reactNativeHost.reactInstanceManager

            log("doWork", mapOf("token" to token))

            reactInstanceManager.packages.mapNotNull { it as? Helper }.forEach { it.onReceive(token) }
            return Result.success()
        }
    }

    interface Helper {
        fun onReceive(token: String)
    }
}
