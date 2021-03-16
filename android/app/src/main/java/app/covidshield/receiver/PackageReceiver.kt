package app.covidshield.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import app.covidshield.extensions.log
import app.covidshield.services.metrics.MetricsService
import okhttp3.*

class PackageReceiver () : BroadcastReceiver() {

    private val okHttpClient by lazy { OkHttpClient() }

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        log("onReceive", mapOf("action" to action))

            if (action == "android.intent.action.MY_PACKAGE_REPLACED") {
                MetricsService.publishPackageUpdatedMetric(context);
            }
    }


}