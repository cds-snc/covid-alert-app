package app.covidshield.module

import app.covidshield.extensions.launch
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.CoroutineContext
import app.covidshield.BuildConfig
import java.security.KeyFactory
import java.security.PublicKey
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import android.util.Base64

private const val PUBLIC_KEY = BuildConfig.OUTBREAK_PUBLIC_KEY;

class OutbreakSignatureValidationModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {
    override fun getName(): String = "OutbreakSignatureValidation"

    override val coroutineContext: CoroutineContext = Dispatchers.IO

    @ReactMethod
    fun isSignatureValid(packageMessage: String, packageSignature: String, promise: Promise) {
        promise.launch(this) {
          try {
            val decodedKey = Base64.decode(PUBLIC_KEY,0)

            val kf = KeyFactory.getInstance("EC")
            val outbreakPublicKey: PublicKey = kf.generatePublic(X509EncodedKeySpec(decodedKey))
            val decodedMessage: ByteArray = Base64.decode(packageMessage,0)
            val decodedSignature: ByteArray = Base64.decode(packageSignature,0)

            val s = Signature.getInstance("SHA256withECDSA")
                  .apply {
                      initVerify(outbreakPublicKey)
                      update(decodedMessage)
                  }

            val isValid: Boolean = s.verify(decodedSignature)
            promise.resolve(isValid)

          } catch (e: Exception) {
              println("OUTBREAK isSignatureValid error:" + e.message)
              promise.resolve(false)
          }
        }
    }
}
