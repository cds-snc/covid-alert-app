package app.covidshield.receiver.worker

import android.app.NotificationManager
import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.facebook.react.ReactApplication
import com.facebook.react.modules.core.RCTNativeAppEventEmitter

class ExposureCheckSchedulerWorker (private val context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    override suspend fun doWork(): Result {

        val reactApplication = applicationContext as? ReactApplication
                ?: return Result.success()
        val reactInstanceManager = reactApplication.reactNativeHost.reactInstanceManager
        reactInstanceManager.currentReactContext?.getJSModule(RCTNativeAppEventEmitter::class.java)?.emit("initiateExposureCheckEvent", "data")

        return Result.success()

    }
}