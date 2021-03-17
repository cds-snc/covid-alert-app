package app.covidshield.services.metrics

import android.content.Context
import android.text.format.DateUtils
import com.facebook.react.modules.storage.AsyncLocalStorageUtil
import com.facebook.react.modules.storage.ReactDatabaseSupplier
import java.util.*

object DebugMetricsLifecycleInformationProvider {

    private const val SharedPreferencesFileKey = "covid-shield-debug-metrics"
    private const val LifecycleDailyCountKey = "lifecycle-daily-count"
    private const val LifecycleDailyCountTimestampKey = "lifecycle-daily-count-timestamp"

    private var cachedLifecycleIdentifier: String? = null
    private var cachedLifecycleDailyCount: Number? = null
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

        // Set timestamp if it does not exist (only the first time this code ever gets executed)
        if (!sharedPreferences.contains(LifecycleDailyCountTimestampKey)) {
            with (sharedPreferences.edit()) {
                putLong(LifecycleDailyCountTimestampKey, Date().time)
                apply()
            }
        }

        fun shouldResetDailyCount(): Boolean {
            val retrievedDailyCountTimestamp = sharedPreferences.getLong(LifecycleDailyCountTimestampKey, Date().time)

            val shouldReset = DateUtils.isToday(retrievedDailyCountTimestamp) == false

            if (shouldReset) {
                with (sharedPreferences.edit()) {
                    putLong(LifecycleDailyCountTimestampKey, Date().time)
                    apply()
                }
            }

            return shouldReset
        }

        return if (cachedLifecycleDailyCount == null) {
            val retrievedDailyCount = if (shouldResetDailyCount()) 0 else sharedPreferences.getInt(LifecycleDailyCountKey, 0)

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

}