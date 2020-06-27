package app.covidshield

import android.content.Intent
import android.view.View
import app.covidshield.module.CovidShieldModule
import app.covidshield.module.ExposureNotificationModule
import app.covidshield.module.PushNotificationModule
import app.covidshield.receiver.ExposureNotificationBroadcastReceiver
import app.covidshield.utils.ActivityResultHelper
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class CustomPackage : ReactPackage, ActivityResultHelper, ExposureNotificationBroadcastReceiver.Helper {

    private var nativeModules: MutableList<NativeModule>? = null

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val nativeModules = mutableListOf<NativeModule>(
            ExposureNotificationModule(reactContext),
            PushNotificationModule(reactContext),
            CovidShieldModule(reactContext)
        )
        this.nativeModules = nativeModules
        return nativeModules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        nativeModules?.mapNotNull { it as? ActivityResultHelper }?.forEach { it.onActivityResult(requestCode, resultCode, data) }
    }

    override fun onReceive(token: String) {
        nativeModules?.mapNotNull { it as? ExposureNotificationBroadcastReceiver.Helper }?.forEach { it.onReceive(token) }
    }
}