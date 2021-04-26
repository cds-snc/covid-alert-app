package app.covidshield.services.metrics

import android.content.Context
import android.text.format.DateUtils
import app.covidshield.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import com.facebook.react.modules.storage.AsyncLocalStorageUtil
import com.facebook.react.modules.storage.ReactDatabaseSupplier
import java.util.*

object DebugMetricsHelper {

    private const val SharedPreferencesFileKey = "covid-shield-debug-metrics"
    private const val LifecycleDailyCountKey = "lifecycle-daily-count"
    private const val SuccessfulDailyBackgroundChecksKey = "successful-daily-background-checks"
    private const val DebugMetricsSwitch = "debug-metrics-switch"

    private const val LifecycleDailyCountResetTimestampKey = "lifecycle-daily-count-reset-timestamp"
    private const val SuccessfulDailyBackgroundChecksResetTimestampKey = "successful-daily-background-checks-reset-timestamp"
    private const val DebugMetricsSwitchResetTimestampKey = "debug-metrics-switch-reset-timestamp"

    private const val configurationUrl = BuildConfig.EN_CONFIG_URL;

    private val okHttpClient by lazy { OkHttpClient() }

    private var cachedLifecycleIdentifier: String? = null
    private var cachedLifecycleDailyCount: Number? = null
    private var cachedSuccessfulDailyBackgroundChecks: Number? = null
    private var cachedActivationFlag: Boolean? = null
    private var cachedDeviceIdentifier: String? = null

    fun getLifecycleIdentifier(): String {

        fun generateAndSaveNewLifecycleIdentifier(): String {
            val uuidAsString = UUID.randomUUID().toString()
            cachedLifecycleIdentifier = uuidAsString
            return uuidAsString
        }

        return if (cachedLifecycleIdentifier == null) {
            generateAndSaveNewLifecycleIdentifier()
        } else {
            cachedLifecycleIdentifier!!
        }
    }

    fun getLifecycleDailyCount(context: Context): Number {

        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        return if (cachedLifecycleDailyCount == null) {
            val retrievedDailyCount = if (didDayChange(LifecycleDailyCountResetTimestampKey, context)) 0 else sharedPreferences.getInt(LifecycleDailyCountKey, 0)

            val incrementedDailyCount = retrievedDailyCount + 1

            cachedLifecycleDailyCount = incrementedDailyCount
            with (sharedPreferences.edit()) {
                putInt(LifecycleDailyCountKey, incrementedDailyCount)
                apply()
            }

            incrementedDailyCount
        } else {
            cachedLifecycleDailyCount!!
        }
    }

    fun getSuccessfulDailyBackgroundChecks(context: Context): Number {

        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        return if (cachedSuccessfulDailyBackgroundChecks == null) {
            val retrievedSuccessfulDailyBackgroundChecks = if (didDayChange(SuccessfulDailyBackgroundChecksResetTimestampKey, context)) 0 else sharedPreferences.getInt(SuccessfulDailyBackgroundChecksKey, 0)
            cachedSuccessfulDailyBackgroundChecks = retrievedSuccessfulDailyBackgroundChecks
            retrievedSuccessfulDailyBackgroundChecks
        } else {
            cachedSuccessfulDailyBackgroundChecks!!
        }
    }

    fun incrementSuccessfulDailyBackgroundChecks(context: Context) {

        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        val successfulDailyBackgroundChecks = getSuccessfulDailyBackgroundChecks(context).toInt()

        with (sharedPreferences.edit()) {
            putInt(SuccessfulDailyBackgroundChecksKey, successfulDailyBackgroundChecks + 1)
            apply()
        }
    }

    fun canPublishDebugMetrics(context: Context): Boolean {

        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        return if (cachedActivationFlag == null) {
            val isActive = if (didDayChange(DebugMetricsSwitchResetTimestampKey, context)) {
                val request = Request.Builder().url(configurationUrl).build()

                val stepsEnabled = okHttpClient.newCall(request).execute().use { response ->
                    if (response.isSuccessful) {
                        val jsonObject = JSONObject(response.body()!!.string())
                        if (jsonObject.has("steps")) {
                            jsonObject.getInt("steps") == 1
                        } else {
                            false
                        }
                    } else {
                        false
                    }
                }

                with (sharedPreferences.edit()) {
                    putBoolean(DebugMetricsSwitch, stepsEnabled)
                    apply()
                }

                stepsEnabled
            } else {
                sharedPreferences.getBoolean(DebugMetricsSwitch, false)
            }

            cachedActivationFlag = isActive
            isActive
        } else {
            cachedActivationFlag!!
        }
    }

    fun getDeviceIdentifier(context: Context): String {
        return if (cachedDeviceIdentifier == null) {
            val retrievedDeviceIdentifier = AsyncLocalStorageUtil.getItemImpl(ReactDatabaseSupplier.getInstance(context).get(), "UUID_KEY")

            if (retrievedDeviceIdentifier.isNullOrEmpty()) {
                "n/a"
            } else {
                cachedDeviceIdentifier = retrievedDeviceIdentifier
                retrievedDeviceIdentifier
            }
        } else {
            cachedDeviceIdentifier!!
        }
    }

    private fun didDayChange(resetTimestampKey: String, context: Context): Boolean {
        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        return if (!sharedPreferences.contains(resetTimestampKey)) {
            with (sharedPreferences.edit()) {
                putLong(resetTimestampKey, Date().time)
                apply()
            }
            true
        } else {
            val resetTimestamp = sharedPreferences.getLong(resetTimestampKey, Date().time)

            val shouldReset = DateUtils.isToday(resetTimestamp) == false

            if (shouldReset) {
                with (sharedPreferences.edit()) {
                    putLong(resetTimestampKey, Date().time)
                    apply()
                }
            }

            shouldReset
        }
    }
}