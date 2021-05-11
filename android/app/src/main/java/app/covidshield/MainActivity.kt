package app.covidshield

import android.content.Intent
import android.os.Bundle
import app.covidshield.services.metrics.FilteredMetricsService
import app.covidshield.services.metrics.MetricType
import app.covidshield.utils.ActivityResultHelper
import com.facebook.react.ReactActivity
import kotlinx.coroutines.runBlocking
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this)

        // Added a thread here to avoid android.os.networkonmainthreadexception due to us trying to push the metric to the server right away while still being on the main thread
        val thread = Thread(Runnable {
            try {
                runBlocking {
                    FilteredMetricsService.getInstance(applicationContext).addMetric(MetricType.ActiveUser, true)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        })

        thread.start()

        super.onCreate(null)
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "CovidShield"
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        reactInstanceManager.packages.mapNotNull { it as? ActivityResultHelper }.forEach { it.onActivityResult(requestCode, resultCode, data) }
    }
}