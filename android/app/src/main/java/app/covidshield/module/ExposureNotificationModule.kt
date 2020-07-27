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
import app.covidshield.utils.CovidShieldException.ApiNotEnabledException
import app.covidshield.utils.CovidShieldException.InvalidActivityException
import app.covidshield.utils.CovidShieldException.NoResolutionRequiredException
import app.covidshield.utils.CovidShieldException.PermissionDeniedException
import app.covidshield.utils.CovidShieldException.PlayServicesNotAvailableException
import app.covidshield.utils.CovidShieldException.SendIntentException
import app.covidshield.utils.CovidShieldException.SummaryTokenNotFoundException
import app.covidshield.utils.CovidShieldException.UnknownException
import app.covidshield.utils.PendingTokenManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient.ACTION_EXPOSURE_NOTIFICATION_SETTINGS
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
            if (!isPlayServicesAvailable()) {
                throw PlayServicesNotAvailableException()
            }
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
            if (!isPlayServicesAvailable()) {
                throw PlayServicesNotAvailableException()
            }
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
            if (getStatusInternal() == Status.DISABLED) {
                throw ApiNotEnabledException()
            }

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
    fun getPendingExposureSummary(promise: Promise) {
        promise.launch(this) {
            if (getStatusInternal() == Status.DISABLED) {
                throw ApiNotEnabledException()
            }

            val tokens = PendingTokenManager.instance.retrieve()
            PendingTokenManager.instance.clear()

            val summaryAndToken = tokens
                .reversed()
                .mapNotNull { token ->
                    val summary = exposureNotificationClient.getExposureSummary(token).await()
                        .toSummary()
                        .takeIf { it.matchedKeyCount > 0 }
                    summary?.let { Pair(it, token) }
                }
                .firstOrNull()

            log("getPendingExposureSummary", mapOf(
                "summary" to summaryAndToken?.first,
                "token" to summaryAndToken?.second
            ))

            promise.resolve(summaryAndToken?.first?.toWritableMap()?.apply {
                putString(SUMMARY_HIDDEN_KEY, summaryAndToken.second)
            })
        }
    }

    @ReactMethod
    fun getTemporaryExposureKeyHistory(promise: Promise) {
        promise.launch(this) {
            if (getStatusInternal() == Status.DISABLED) {
                throw ApiNotEnabledException()
            }

            val exposureKeys = getTemporaryExposureKeyHistoryInternal()
            promise.resolve(exposureKeys.toWritableArray())
        }
    }

    @ReactMethod
    fun getExposureInformation(summary: ReadableMap, promise: Promise) {
        promise.launch(this) {
            if (getStatusInternal() == Status.DISABLED) {
                throw ApiNotEnabledException()
            }

            val token = summary.getString(SUMMARY_HIDDEN_KEY)
                ?: throw SummaryTokenNotFoundException()
            val exposureInformationList = exposureNotificationClient.getExposureInformation(token).await()
            val informationList = exposureInformationList.map { it.toInformation() }.toWritableArray()
            promise.resolve(informationList)
        }
    }

    private suspend fun startInternal() {
        val activity = currentActivity ?: throw InvalidActivityException()
        startResolutionCompleter?.await()
        try {
            exposureNotificationClient.start().await()
        } catch (exception: Exception) {
            if (exception !is ApiException) {
                throw UnknownException(exception)
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
                    startResolutionCompleter?.completeExceptionally(SendIntentException(exception))
                } catch (exception: Exception) {
                    startResolutionCompleter?.completeExceptionally(PermissionDeniedException(exception))
                } finally {
                    startResolutionCompleter = null
                }
            } else {
                log(exception.message)
                throw NoResolutionRequiredException(exception)
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
                throw UnknownException(exception)
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
                    getTekResolutionCompleter?.completeExceptionally(SendIntentException(exception))
                } catch (exception: Exception) {
                    getTekResolutionCompleter?.completeExceptionally(PermissionDeniedException(exception))
                } finally {
                    getTekResolutionCompleter = null
                }
            } else {
                throw NoResolutionRequiredException(exception)
            }
        }
        throw UnknownException()
    }

    private suspend fun stopInternal() {
        try {
            exposureNotificationClient.stop().await()
        } catch (_: Exception) {
            // Noop
        }
    }

    private suspend fun getStatusInternal(): Status {
        if (!isPlayServicesAvailable()) {
            return Status.PLAY_SERVICES_NOT_AVAILABLE
        }
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

    private fun isPlayServicesAvailable(): Boolean {
        val context = reactApplicationContext.applicationContext
        val exposureNotificationSettingsIntent = Intent(ACTION_EXPOSURE_NOTIFICATION_SETTINGS)
        return exposureNotificationSettingsIntent.resolveActivity(context.packageManager) != null
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
    BLUETOOTH_OFF("bluetooth_off"),
    PLAY_SERVICES_NOT_AVAILABLE("play_services_not_available")
}
