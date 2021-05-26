package app.covidshield.module

import app.covidshield.extensions.launch
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.CoroutineContext

class OutbreakSignatureValidationModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {
    override fun getName(): String = "OutbreakSignatureValidation"

    override val coroutineContext: CoroutineContext = Dispatchers.IO

    @ReactMethod
    fun isSignatureValid(message: String, signature: String, promise: Promise) {
        promise.launch(this) {

            val isValid = true
            
            // logic goes here

            promise.resolve(isValid)
        }
    }
}