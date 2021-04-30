package app.covidshield.module

import app.covidshield.extensions.launch
import app.covidshield.services.metrics.DebugMetricsHelper
import app.covidshield.services.metrics.MetricType
import app.covidshield.services.metrics.FilteredMetricsService
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.CoroutineContext

class DebugMetricsModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {
    override fun getName(): String = "DebugMetrics"

    override val coroutineContext: CoroutineContext = Dispatchers.IO

    @ReactMethod
    fun publishDebugMetric(stepNumber: Double, message: String, promise: Promise) {
        promise.launch(this) {

            val filteredMetricsService = FilteredMetricsService.getInstance(context)
            filteredMetricsService.addDebugMetric(stepNumber, message)

            // This is the current final step we have and it is published from the React layer
            if (stepNumber == 8.0) {
                DebugMetricsHelper.incrementSuccessfulDailyBackgroundChecks(context)
                filteredMetricsService.addMetric(MetricType.ScheduledCheckSuccessfulToday, true)
            }

            promise.resolve(null)
        }
    }
}