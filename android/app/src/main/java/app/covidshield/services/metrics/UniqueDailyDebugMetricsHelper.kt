package app.covidshield.services.metrics

import android.content.Context
import app.covidshield.utils.DateUtils
import java.util.*

object UniqueDailyDebugMetricsHelper {

    private const val SharedPreferencesFileKey = "covid-shield-unique-daily-debug-metrics"

    fun canPublishMetric(metricIdentifier: String, context: Context): Boolean {
        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        return if (sharedPreferences.contains(metricIdentifier)) {
            val retrievedUTCDateInMilliseconds = sharedPreferences.getLong(metricIdentifier, 0)
            !DateUtils.isSameDay(Date(retrievedUTCDateInMilliseconds), Date(System.currentTimeMillis()))
        } else {
            true
        }
    }

    fun markMetricAsPublished(metricIdentifier: String, context: Context) {
        val sharedPreferences = context.getSharedPreferences(SharedPreferencesFileKey, Context.MODE_PRIVATE)

        with (sharedPreferences.edit()) {
            putLong(metricIdentifier, System.currentTimeMillis())
            apply()
        }
    }

}