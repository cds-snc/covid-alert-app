package app.covidshield.module

import app.covidshield.extensions.launch
import app.covidshield.services.metrics.MetricsService
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
    fun publishDebugMetric(stepNumber: Double, promise: Promise) {
        promise.launch(this) {
            MetricsService.publishDebugMetric(stepNumber, context)
            promise.resolve(null)
        }
    }
}