package app.covidshield.module

import app.covidshield.extensions.bindPromise
import app.covidshield.extensions.parse
import app.covidshield.extensions.rejectOnException
import app.covidshield.extensions.toExposureConfiguration
import app.covidshield.extensions.toExposureKey
import app.covidshield.extensions.toInformation
import app.covidshield.extensions.toSummary
import app.covidshield.extensions.toWritableArray
import app.covidshield.extensions.toWritableMap
import app.covidshield.models.Configuration
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.nearby.Nearby
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
        exposureNotificationClient.start().bindPromise(promise) {
            resolve(Unit)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        exposureNotificationClient.stop().bindPromise(promise) {
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
        exposureNotificationClient.isEnabled.bindPromise(promise, Status.DISABLED.value) { isEnabled ->
            val status = if (isEnabled) Status.ACTIVE else Status.DISABLED
            resolve(status.value)
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
}

private enum class Status(val value: String) {
    ACTIVE("active"),
    DISABLED("disabled")
}
