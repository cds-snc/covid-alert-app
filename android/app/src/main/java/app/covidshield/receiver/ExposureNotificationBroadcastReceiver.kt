package app.covidshield.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.work.Data
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import app.covidshield.extensions.log
import app.covidshield.receiver.worker.HeadlessJsTaskWorker
import app.covidshield.receiver.worker.HeadlessJsTaskWorker.Companion.shouldStartHeadlessJsTask
import app.covidshield.receiver.worker.StateUpdatedWorker
import app.covidshield.utils.PendingTokenManager
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient.ACTION_EXPOSURE_NOT_FOUND
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient.ACTION_EXPOSURE_STATE_UPDATED
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient.EXTRA_TOKEN

class ExposureNotificationBroadcastReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        log("onReceive", mapOf("action" to action))

        if (action == ACTION_EXPOSURE_STATE_UPDATED || action == ACTION_EXPOSURE_NOT_FOUND) {
            val token = intent.getStringExtra(EXTRA_TOKEN)
            if (token.isNullOrEmpty()) {
                log("Token not found")
                return
            }
            if (shouldStartHeadlessJsTask(context)) {
                startHeadlessJsTaskWorker(context, token)
            } else {
                startStateUpdateWorker(context, token)
            }
        }
    }

    private fun startStateUpdateWorker(context: Context, token: String) {
        log("startStateUpdateWorker", mapOf("token" to token))

        val workManager: WorkManager = WorkManager.getInstance(context)
        val inputData = Data.Builder()
            .putString(EXTRA_TOKEN, token)
            .build()

        workManager.enqueue(
            OneTimeWorkRequest.Builder(StateUpdatedWorker::class.java)
                .setInputData(inputData)
                .build()
        )
    }

    private fun startHeadlessJsTaskWorker(context: Context, token: String) {
        log("startHeadlessJsTaskWorker", mapOf("token" to token))

        PendingTokenManager.instance.add(token)

        val workManager: WorkManager = WorkManager.getInstance(context)
        workManager.enqueueUniqueWork(
            "StartHeadlessJsTaskWorker",
            ExistingWorkPolicy.REPLACE,
            OneTimeWorkRequest.Builder(HeadlessJsTaskWorker::class.java).build()
        )
    }

    interface Helper {
        fun onReceive(token: String)
    }
}
