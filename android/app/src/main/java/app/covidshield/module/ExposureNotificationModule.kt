package app.covidshield.module

import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.content.IntentSender
import app.covidshield.extensions.cleanup
import app.covidshield.extensions.launch
import app.covidshield.extensions.log
import app.covidshield.extensions.parse
import app.covidshield.extensions.toExposureConfiguration
import app.covidshield.extensions.toExposureKey
import app.covidshield.extensions.toInformation
import app.covidshield.extensions.toSummary
import app.covidshield.extensions.toWritableArray
import app.covidshield.extensions.toWritableMap
import app.covidshield.models.Configuration
import app.covidshield.models.ExposureKey
import app.covidshield.receiver.ExposureNotificationBroadcastReceiver
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
import java.util.*
import kotlin.coroutines.CoroutineContext

private const val SUMMARY_HIDDEN_KEY = "_summaryIdx"

private typealias Token = String

private const val START_RESOLUTION_FOR_RESULT_REQUEST_CODE = 9001
private const val GET_TEK_RESOLUTION_FOR_RESULT_REQUEST_CODE = 9002

class ExposureNotificationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope, ActivityResultHelper, ExposureNotificationBroadcastReceiver.Helper {

    private val exposureNotificationClient by lazy {
        Nearby.getExposureNotificationClient(context.applicationContext)
    }

    private var startResolutionCompleter: CompletableDeferred<Unit>? = null
    private var getTekResolutionCompleter: CompletableDeferred<Unit>? = null
    private var detectExposureResolutionCompleters = hashMapOf<Token, CompletableDeferred<Token>?>()

    private val bluetoothAdapter get() = BluetoothAdapter.getDefaultAdapter()

    override fun getName(): String = "ExposureNotification"

    override val coroutineContext: CoroutineContext get() = Dispatchers.Default

    @ReactMethod
    fun start(promise: Promise) {
        promise.launch(this) {
            val status = getStatusInternal()
            if (status != Status.ACTIVE) {
                stopInternal()
                startInternal()
            }
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        promise.launch(this) {
            stopInternal()
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
            val status = getStatusInternal()
            promise.resolve(status.value)
        }
    }

    @ReactMethod
    fun detectExposure(configuration: ReadableMap, diagnosisKeysURLs: ReadableArray, promise: Promise) {
        promise.launch(this) {
            val exposureConfiguration = configuration.parse(Configuration::class.java).toExposureConfiguration()
            val files = diagnosisKeysURLs.parse(String::class.java).map { File(it) }
            val token = "${UUID.randomUUID()}-${Date().time}"
            log("detectExposure", mapOf("token" to token, "files" to files))

            exposureNotificationClient.provideDiagnosisKeys(files, exposureConfiguration, token).await()

            // Clean up files after feeding to the framework
            files.forEach { it.cleanup() }

            // Wait for ExposureNotificationBroadcastReceiver
            val completer = CompletableDeferred<Token>()
            detectExposureResolutionCompleters[token] = completer
            completer.await()
            detectExposureResolutionCompleters.remove(token)

            val exposureSummary = exposureNotificationClient.getExposureSummary(token).await()
            val summary = exposureSummary.toSummary()
            log("detectExposure", mapOf("token" to token, "summary" to summary))

            promise.resolve(summary.toWritableMap().apply {
                putString(SUMMARY_HIDDEN_KEY, token)
            })
        }
    }

    @ReactMethod
    fun getTemporaryExposureKeyHistory(promise: Promise) {
        promise.launch(this) {
            val exposureKeys = getTemporaryExposureKeyHistoryInternal()
            promise.resolve(exposureKeys.toWritableArray())
        }
    }

    @ReactMethod
    fun getExposureInformation(summary: ReadableMap, promise: Promise) {
        promise.launch(this) {
            val token = summary.getString(SUMMARY_HIDDEN_KEY)
                ?: throw IllegalArgumentException("Invalid summary token")
            val exposureInformationList = exposureNotificationClient.getExposureInformation(token).await()
            val informationList = exposureInformationList.map { it.toInformation() }.toWritableArray()
            promise.resolve(informationList)
        }
    }

    private suspend fun startInternal() {
        val activity = currentActivity ?: throw IllegalStateException("Invalid activity")
        startResolutionCompleter?.await()
        try {
            exposureNotificationClient.start().await()
        } catch (exception: Exception) {
            if (exception !is ApiException) {
                throw Exception("UNKNOWN_ERROR", exception)
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
                    startResolutionCompleter?.completeExceptionally(Exception("SEND_INTENT_EXCEPTION", exception))
                } catch (exception: Exception) {
                    startResolutionCompleter?.completeExceptionally(Exception("PERMISSION_DENIED", exception))
                } finally {
                    startResolutionCompleter = null
                }
            } else {
                log(exception.message)
                throw Exception("NO_RESOLUTION_REQUIRED", exception)
            }
        }
    }

    private suspend fun getTemporaryExposureKeyHistoryInternal(): List<ExposureKey> {
        val activity = currentActivity ?: throw IllegalStateException("Invalid activity")
        getTekResolutionCompleter?.await()
        try {
            val tekKeys = exposureNotificationClient.temporaryExposureKeyHistory.await()
            return tekKeys.map { it.toExposureKey() }
        } catch (exception: Exception) {
            if (exception !is ApiException) {
                throw Exception("UNKNOWN_ERROR", exception)
            }
            if (exception.statusCode == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                getTekResolutionCompleter = CompletableDeferred()
                try {
                    exception.status.startResolutionForResult(
                        activity,
                        GET_TEK_RESOLUTION_FOR_RESULT_REQUEST_CODE
                    )
                    getTekResolutionCompleter?.await()
                    getTekResolutionCompleter = null
                    return getTemporaryExposureKeyHistoryInternal()
                } catch (exception: IntentSender.SendIntentException) {
                    getTekResolutionCompleter?.completeExceptionally(Exception("SEND_INTENT_EXCEPTION", exception))
                } catch (exception: Exception) {
                    getTekResolutionCompleter?.completeExceptionally(Exception("PERMISSION_DENIED", exception))
                } finally {
                    getTekResolutionCompleter = null
                }
            } else {
                throw Exception("NO_RESOLUTION_REQUIRED", exception)
            }
        }
        throw Exception("UNKNOWN_ERROR")
    }

    private suspend fun stopInternal() {
        try {
            exposureNotificationClient.stop().await()
        } catch (_: Exception) {
            // Noop
        }
    }

    private suspend fun getStatusInternal(): Status {
        val isExposureNotificationEnabled = try {
            exposureNotificationClient.isEnabled.await()
        } catch (_: Exception) {
            false
        }
        val isBluetoothEnabled = try {
            bluetoothAdapter.isEnabled
        } catch (_: Exception) {
            false
        }
        return when {
            !isExposureNotificationEnabled -> Status.DISABLED
            !isBluetoothEnabled -> Status.BLUETOOTH_OFF
            else -> Status.ACTIVE
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val completer = when (requestCode) {
            START_RESOLUTION_FOR_RESULT_REQUEST_CODE -> startResolutionCompleter
            GET_TEK_RESOLUTION_FOR_RESULT_REQUEST_CODE -> getTekResolutionCompleter
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

    override fun onReceive(token: String) {
        val completer = detectExposureResolutionCompleters[token] ?: return
        completer.complete(token)
    }
}

private enum class Status(val value: String) {
    ACTIVE("active"),
    DISABLED("disabled"),
    BLUETOOTH_OFF("bluetooth_off")
}
