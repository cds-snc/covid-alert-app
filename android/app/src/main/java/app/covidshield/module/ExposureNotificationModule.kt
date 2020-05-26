package app.covidshield.module

import app.covidshield.extensions.toWritableArray
import app.covidshield.extensions.toWritableMap
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
        // THis method does not exist in the android nearby SDK.
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
        // Get keys.
        promise.resolve(emptyMap<String, String>().toWritableMap())
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
    fun getExposureInformation(_summary: ReadableMap, promise: Promise) {
        // Summary is useless here. We need the keys.
        val summary = Summary.fromMap(_summary)
//        exposureNotificationClient.getExposureInformation(// Pass keys in here)
//            .addOnSuccessListener { information ->
//                val writableNativeArray = WritableNativeArray()
//                information.forEach {
//                    writableNativeArray.pushMap(Information.fromExposureInformation(it).toMap())
//                }
//                promise.resolve(writableNativeArray)
//            }
//            .addOnCanceledListener {
//                promise.reject(Exception("Cancelled"))
//            }
    }
}

fun <T> Task<T>.bindPromise(promise: Promise, successBlock: Promise.(T) -> Unit) {
    this.addOnFailureListener { promise.reject(it) }.addOnSuccessListener {successBlock.invoke(promise, it)}
}

fun <T, R> Task<T>.bindPromise(promise: Promise, failureValue: R, successBlock: Promise.(T) -> Unit) {
    this.addOnFailureListener { promise.resolve(failureValue) }.addOnSuccessListener {successBlock.invoke(promise, it)}
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