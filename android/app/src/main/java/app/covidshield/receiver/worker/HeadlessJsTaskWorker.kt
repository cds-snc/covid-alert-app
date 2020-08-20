package app.covidshield.receiver.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import app.covidshield.extensions.log
import com.facebook.react.ReactApplication
import com.transistorsoft.rnbackgroundfetch.HeadlessTask
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout

private const val HEADLESS_JS_TASK_NAME = "EXPOSURE_NOTIFICATION_BROADCAST_RECEIVER"
private const val HEADLESS_JS_TASK_TIMEOUT_MS = 60000L

class HeadlessJsTaskWorker(
    appContext: Context,
    params: WorkerParameters
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        log("HeadlessJsTaskWorker", mapOf("shouldStartHeadlessJsTask" to shouldStartHeadlessJsTask(applicationContext)))

        if (!shouldStartHeadlessJsTask(applicationContext)) {
            return Result.success()
        }

        try {
            withTimeout(HEADLESS_JS_TASK_TIMEOUT_MS) {
                withContext(Dispatchers.Main) {
                    val completer = CompletableDeferred<Unit>()
                    CustomHeadlessTask(applicationContext, HEADLESS_JS_TASK_NAME) { completer.complete(Unit) }
                    completer.await()
                }
            }
        } catch (_: TimeoutCancellationException) {
            log("doWork exception", mapOf("message" to "Timeout"))
        } catch (exception: Exception) {
            log("doWork exception", mapOf("message" to (exception.message ?: "Unknown")))
        }

        return Result.success()
    }

    private class CustomHeadlessTask(
        context: Context,
        taskId: String,
        private val onComplete: () -> Unit
    ) : HeadlessTask(context, taskId) {

        override fun onHeadlessJsTaskStart(taskId: Int) {
            super.onHeadlessJsTaskStart(taskId)
            log("onHeadlessJsTaskStart")
        }

        override fun onHeadlessJsTaskFinish(taskId: Int) {
            super.onHeadlessJsTaskFinish(taskId)
            log("onHeadlessJsTaskFinish")
            onComplete()
        }
    }

    companion object {

        fun shouldStartHeadlessJsTask(context: Context): Boolean {
            return try {
                val reactApplication = context.applicationContext as ReactApplication
                val reactNativeHost = reactApplication.reactNativeHost
                val reactInstanceManager = reactNativeHost.reactInstanceManager
                val currentReactContext = reactInstanceManager.currentReactContext
                currentReactContext == null
            } catch (_: Exception) {
                false
            }
        }
    }
}