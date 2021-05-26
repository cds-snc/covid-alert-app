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

    private const val publicKey = BuildConfig.OUTBREAK_PUBLIC_KEY;

    @ReactMethod
    fun isSignatureValid(packageMessage: String, packageSignature: String, promise: Promise) {
        promise.launch(this) {
          try {
            val decodedBytes = Base64.getDecoder().decode(publicKey);
            val kf = KeyFactory.getInstance("EC")
            val outbreakPublicKey: PublicKey = kf.generatePublic(X509EncodedKeySpec(decodedBytes))
            val decodedMessage: ByteArray = Base64.getDecoder().decode(packageMessage)
            val decodedSignature: ByteArray = Base64.getDecoder().decode(packageSignature)

            val s = Signature.getInstance("SHA256withECDSA")
                  .apply {
                      initVerify(outbreakPublicKey)
                      update(decodedMessage)
                  }

            val isValid: Boolean = s.verify(decodedSignature)
            promise.resolve(isValid)

          } catch (e: Exception) {
              println(e.message)
              promise.resolve(false)
          }
        }
    }
}
