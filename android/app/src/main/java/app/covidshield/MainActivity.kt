package app.covidshield

import android.content.Intent
import android.os.Bundle
import app.covidshield.utils.ActivityResultHelper
import com.facebook.react.ReactActivity
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this)
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