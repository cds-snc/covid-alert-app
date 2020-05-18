package app.covidshield.module

import app.covidshield.extensions.toWritableArray
import app.covidshield.extensions.toWritableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.nearby.Nearby

class ExposureNotificationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    private val exposureNotificationClient = Nearby.getExposureNotificationClient(context.applicationContext)

    override fun getName(): String = "ExposureNotification"

    @ReactMethod
    fun start(promise: Promise) {
        promise.resolve(null)
    }

    @ReactMethod
    fun stop(promise: Promise) {
        exposureNotificationClient.stop()
            .addOnCompleteListener {
                promise.resolve(null)
            }
    }

    @ReactMethod
    fun resetAllData(promise: Promise) {
        promise.resolve(null)
    }

    @ReactMethod
    fun getStatus(promise: Promise) {
        exposureNotificationClient.isEnabled
            .addOnSuccessListener {
                val status = if (it) Status.ACTIVE else Status.DISABLED
                promise.resolve(status.value)
            }
            .addOnFailureListener {
                promise.resolve(Status.DISABLED.value)
            }
    }

    @ReactMethod
    fun detectExposure(configuration: ReadableMap, diagnosisKeysURLs: ReadableArray, promise: Promise) {
        promise.resolve(emptyMap<String, String>().toWritableMap())
    }

    @ReactMethod
    fun getExposureInformation(keys: ReadableArray, promise: Promise) {
        promise.resolve(emptyList<Any>().toWritableArray())
    }
}

private enum class Status(val value: String) {
    ACTIVE("active"),
    DISABLED("disabled")
}