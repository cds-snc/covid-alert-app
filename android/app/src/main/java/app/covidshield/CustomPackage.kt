package app.covidshield

import android.view.View
import app.covidshield.module.CovidShieldModule
import app.covidshield.module.ExposureNotificationModule
import app.covidshield.module.PushNotificationModule
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class CustomPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> = mutableListOf(
        ExposureNotificationModule(reactContext),
        PushNotificationModule(reactContext),
        CovidShieldModule(reactContext)
    )

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()
}