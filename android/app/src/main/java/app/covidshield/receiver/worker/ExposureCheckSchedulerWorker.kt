package app.covidshield.receiver.worker

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.facebook.react.ReactApplication
import com.facebook.react.modules.core.RCTNativeAppEventEmitter

class ExposureCheckSchedulerWorker (context: Context, parameters: WorkerParameters) :
        CoroutineWorker(context, parameters) {

    override suspend fun doWork(): Result {
        Log.d("background", "ExposureCheckSchedulerWorker - doWork")
        try {
            val reactApplication = applicationContext as? ReactApplication ?: return Result.success()
            val reactInstanceManager = reactApplication.reactNativeHost.reactInstanceManager
            reactInstanceManager.currentReactContext?.getJSModule(RCTNativeAppEventEmitter::class.java)?.emit("initiateExposureCheckEvent", "data")
        } catch (exception: Exception){
            Log.d("exception", "exception")
        }

        return Result.success()

    }
}