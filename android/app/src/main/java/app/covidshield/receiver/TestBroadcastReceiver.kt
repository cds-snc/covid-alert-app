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
import com.facebook.react.ReactInstanceManager
import com.facebook.react.jstasks.HeadlessJsTaskContext
import com.facebook.react.jstasks.HeadlessJsTaskEventListener
import com.transistorsoft.rnbackgroundfetch.HeadlessTask
import com.transistorsoft.tsbackgroundfetch.BackgroundFetch
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout

private const val HEADLESS_JS_TASK_TIMEOUT_MS = 30000L

class TestBroadcastReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val backgroundFetch = BackgroundFetch.getInstance(context)
        val action = intent.action
        log("onReceive", mapOf("action" to action, "isMainActivityActive" to backgroundFetch.isMainActivityActive))

        if (backgroundFetch.isMainActivityActive) {
            return
        }

        val workManager: WorkManager = WorkManager.getInstance(context)
        val inputData = Data.Builder().build()
        workManager.enqueue(
            OneTimeWorkRequest.Builder(HeadlessJsTaskWorker::class.java)
                .setInputData(inputData)
                .build()
        )
    }

    class HeadlessJsTaskWorker(
        appContext: Context,
        params: WorkerParameters
    ) : CoroutineWorker(appContext, params) {

        override suspend fun doWork(): Result {
            val backgroundFetch = BackgroundFetch.getInstance(applicationContext)
            log("doWork", mapOf("isMainActivityActive" to backgroundFetch.isMainActivityActive))

            if (backgroundFetch.isMainActivityActive) {
                return Result.success()
            }

            try {
                withTimeout(HEADLESS_JS_TASK_TIMEOUT_MS) {
                    withContext(Dispatchers.Main) {
                        startHeadlessJsTask(applicationContext).await()
                    }
                }
            } catch (_: TimeoutCancellationException) {
                log("doWork exception", mapOf("message" to "Timeout"))
            } catch (exception: Exception) {
                log("doWork exception", mapOf("message" to (exception.message ?: "Unknown")))
            }

            return Result.success()
        }

        private fun startHeadlessJsTask(context: Context): CompletableDeferred<Unit> {
            val completer = CompletableDeferred<Unit>()
            val reactApplication = context.applicationContext as ReactApplication
            val reactNativeHost = reactApplication.reactNativeHost
            val reactInstanceManager: ReactInstanceManager = reactNativeHost.reactInstanceManager
            val reactContext = reactInstanceManager.currentReactContext
            val headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext)

            headlessJsTaskContext.addTaskEventListener(object : HeadlessJsTaskEventListener {
                override fun onHeadlessJsTaskFinish(taskId: Int) {
                    log("onHeadlessJsTaskFinish")
                    headlessJsTaskContext.removeTaskEventListener(this)
                    completer.complete(Unit)
                }

                override fun onHeadlessJsTaskStart(taskId: Int) {
                    // Noop
                }
            })
            HeadlessTask(context, "BackgroundFetch")

            return completer
        }
    }
}
