package app.covidshield.module

import android.app.Activity
import android.content.Intent
import android.content.IntentSender
import app.covidshield.extensions.bindPromise
import app.covidshield.extensions.launch
import app.covidshield.extensions.log
import app.covidshield.extensions.parse
import app.covidshield.extensions.rejectOnException
import app.covidshield.extensions.toExposureConfiguration
import app.covidshield.extensions.toExposureKey
import app.covidshield.extensions.toInformation
import app.covidshield.extensions.toSummary
import app.covidshield.extensions.toWritableArray
import app.covidshield.extensions.toWritableMap
import app.covidshield.models.Configuration
import app.covidshield.utils.ActivityResultHelper
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import java.io.File
import java.util.UUID
import kotlin.coroutines.CoroutineContext

private const val SUMMARY_HIDDEN_KEY = "_summaryIdx"

class ExposureNotificationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope, ActivityResultHelper {

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context.applicationContext)
    }

    private var startResolutionCompleter: CompletableDeferred<Any>? = null

    override fun getName(): String = "ExposureNotification"

    override val coroutineContext: CoroutineContext get() = Dispatchers.Default

    @ReactMethod
    fun start(promise: Promise) {
        promise.launch(this) {
            startInternal()
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        promise.launch(this) {
            try {
                exposureNotificationClient.stop().await()
            } catch (_: Exception) {
                // Noop
            }
        }
    }

    @ReactMethod
    fun resetAllData(promise: Promise) {
        // This method does not exist in the android nearby SDK.
        promise.resolve(null)
    }

    @ReactMethod
    fun getStatus(promise: Promise) {
        promise.launch(this) {
            val status = try {
                val isEnabled = exposureNotificationClient.isEnabled.await()
                if (isEnabled) Status.ACTIVE else Status.DISABLED
            } catch (_: Exception) {
                Status.DISABLED
            }
            promise.resolve(status.value)
        }
    }

    @ReactMethod
    fun detectExposure(configuration: ReadableMap, diagnosisKeysURLs: ReadableArray, promise: Promise) {
        promise.rejectOnException {
            val exposureConfiguration = configuration.parse(Configuration::class.java).toExposureConfiguration()
            val files = diagnosisKeysURLs.parse(String::class.java).map { File(it) }
            val token = UUID.randomUUID().toString()
            exposureNotificationClient
                .provideDiagnosisKeys(files, exposureConfiguration, token)
                .continueWithTask { exposureNotificationClient.getExposureSummary(token) }
                .bindPromise(promise) { exposureSummary ->
                    val summary = exposureSummary.toSummary().toWritableMap().apply {
                        putString(SUMMARY_HIDDEN_KEY, token)
                    }
                    resolve(summary)
                }
        }
    }

    @ReactMethod
    fun getTemporaryExposureKeyHistory(promise: Promise) {
        exposureNotificationClient.temporaryExposureKeyHistory.bindPromise(promise) { keys ->
            val exposureKeys = keys.map { it.toExposureKey() }.toWritableArray()
            resolve(exposureKeys)
        }
    }

    @ReactMethod
    fun getExposureInformation(summary: ReadableMap, promise: Promise) {
        promise.rejectOnException {
            val token = summary.getString(SUMMARY_HIDDEN_KEY)
                ?: throw IllegalArgumentException("Invalid summary token")
            exposureNotificationClient.getExposureInformation(token).bindPromise(promise) { exposureInformationList ->
                val informationList = exposureInformationList.map { it.toInformation() }.toWritableArray()
                resolve(informationList)
            }
        }
    }

    private suspend fun startInternal() {
        val activity = currentActivity ?: throw IllegalStateException("Invalid activity")
        try {
            exposureNotificationClient.start().await()
        } catch (exception: Exception) {
            if (exception !is ApiException) {
                log("Unknown error")
                throw exception
            }
            if (exception.statusCode == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                startResolutionCompleter = CompletableDeferred()
                try {
                    exception.status.startResolutionForResult(
                        activity,
                        START_RESOLUTION_FOR_RESULT_REQUEST_CODE
                    )
                    startResolutionCompleter?.await()
                    startResolutionCompleter = null
                    startInternal()
                } catch (exception: IntentSender.SendIntentException) {
                    log("Error when calling startResolutionForResult")
                    startResolutionCompleter?.completeExceptionally(exception)
                } catch (exception: Exception) {
                    log("User denied permission")
                } finally {
                    startResolutionCompleter = null
                }
            } else {
                log("Unknown error")
                throw Error(exception)
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val completer = when (requestCode) {
            START_RESOLUTION_FOR_RESULT_REQUEST_CODE -> startResolutionCompleter
            else -> return
        }
        launch {
            if (resultCode == Activity.RESULT_OK) {
                completer?.complete(Unit)
            } else {
                completer?.completeExceptionally(Exception())
            }
        }
    }

    companion object {

        private const val START_RESOLUTION_FOR_RESULT_REQUEST_CODE = 9001
    }
}

private enum class Status(val value: String) {
    ACTIVE("active"),
    DISABLED("disabled")
}
