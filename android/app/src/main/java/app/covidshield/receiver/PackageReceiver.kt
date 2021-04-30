package app.covidshield.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import app.covidshield.extensions.log
import app.covidshield.services.metrics.MetricType
import app.covidshield.services.metrics.FilteredMetricsService
import kotlinx.coroutines.runBlocking

class PackageReceiver () : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        log("onReceive", mapOf("action" to action))

            if (action == "android.intent.action.MY_PACKAGE_REPLACED") {
                val filteredMetricsService = FilteredMetricsService.getInstance(context)
                runBlocking {
                    filteredMetricsService.addMetric(MetricType.PackageUpdated, false)
                }
            }
    }


}