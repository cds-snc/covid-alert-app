package app.covidshield.module

import app.covidshield.models.Configuration
import app.covidshield.models.ExposureKey
import app.covidshield.models.Information
import app.covidshield.models.Summary
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.tasks.Task
import java.io.File
import java.util.UUID

private const val SUMMARY_HIDDEN_KEY = "_summaryIdx"

class ExposureNotificationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context.applicationContext)
    }

    override fun getName(): String = "ExposureNotification"

    @ReactMethod
    fun start(promise: Promise) {
        exposureNotificationClient.start()
            .bindPromise(promise) {
                resolve(Unit)
            }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        exposureNotificationClient.stop()
            .bindPromise(promise) {
                resolve(Unit)
            }
    }

    @ReactMethod
    fun resetAllData(promise: Promise) {
        // This method does not exist in the android nearby SDK.
        promise.resolve(null)
    }

    @ReactMethod
    fun getStatus(promise: Promise) {
        exposureNotificationClient.isEnabled
            .bindPromise(promise, Status.DISABLED.value) {
                val status = if (it) Status.ACTIVE else Status.DISABLED
                resolve(status.value)
            }
    }

    @ReactMethod
    fun detectExposure(configuration: ReadableMap, diagnosisKeysURLs: ReadableArray, promise: Promise) {
        promise.rejectOnException {
            val config = Configuration.fromMap(configuration).toGoogleConfig()
            val files = diagnosisKeysURLs.toArrayList().map { File(it.toString()) }
            val token = UUID.randomUUID()
            exposureNotificationClient.provideDiagnosisKeys(files, config, token.toString()).bindPromise(promise) {
                exposureNotificationClient.getExposureSummary(token.toString()).bindPromise(promise) {
                    val map = Summary.fromExposureSummary(it).toMap()
                    map?.putString(SUMMARY_HIDDEN_KEY, token.toString())
                    resolve(map)
                }
            }
        }
    }

    @ReactMethod
    fun getTemporaryExposureKeyHistory(promise: Promise) {
        exposureNotificationClient.temporaryExposureKeyHistory.bindPromise(promise) { keys ->
            rejectOnException {
                val writableNativeArray = WritableNativeArray()
                keys.forEach {
                    writableNativeArray.pushMap(ExposureKey.fromGoogleKey(it).toMap())
                }
                resolve(writableNativeArray)
            }
        }
    }

    @ReactMethod
    fun getExposureInformation(summary: ReadableMap, promise: Promise) {
        promise.rejectOnException {
            val token = summary.getString(SUMMARY_HIDDEN_KEY) ?: throw NullPointerException("token is null")
            exposureNotificationClient.getExposureInformation(token).bindPromise(promise) { exposureInformationList ->
                val writableNativeArray = WritableNativeArray()
                exposureInformationList.forEach {
                    writableNativeArray.pushMap(Information.fromExposureInformation(it).toMap())
                }
                resolve(writableNativeArray)
            }
        }
    }
}

fun <T> Task<T>.bindPromise(promise: Promise, successBlock: Promise.(T) -> Unit) {
    this.addOnFailureListener { promise.reject(it) }.addOnSuccessListener { successBlock.invoke(promise, it) }
}

fun <T, R> Task<T>.bindPromise(promise: Promise, failureValue: R, successBlock: Promise.(T) -> Unit) {
    this.addOnFailureListener { promise.resolve(failureValue) }.addOnSuccessListener { successBlock.invoke(promise, it) }
}

fun Promise.rejectOnException(block: () -> Unit) {
    try {
        block.invoke()
    } catch (e: Exception) {
        this.reject(e)
    }
}

private enum class Status(val value: String) {
    ACTIVE("active"),
    DISABLED("disabled")
}
