package app.covidshield.module

import android.content.Context
import android.util.Base64
import app.covidshield.extensions.toWritableArray
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okio.BufferedSource
import java.math.BigInteger
import java.security.SecureRandom
import java.util.UUID
import kotlin.coroutines.CoroutineContext


class CovidShieldModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    private val okHttpClient by lazy { OkHttpClient() }

    override fun getName(): String = "CovidShield"

    override val coroutineContext: CoroutineContext = Dispatchers.IO

    @ReactMethod
    fun getRandomBytes(size: Int, promise: Promise) {
        val bytes = SecureRandom().generateSeed(size)
        val base64Encoded = Base64.encodeToString(bytes, Base64.DEFAULT)
        promise.resolve(base64Encoded)
    }

    @ReactMethod
    fun downloadDiagnosisKeysFile(url: String, promise: Promise) {
        launch(Dispatchers.IO) {
            try {
                val request = Request.Builder().url(url).build()
                val response = okHttpClient.newCall(request).execute().takeIf { it.code() == 200 }
                    ?: throw Error("Network error")
                val bytes = response.body()?.bytes() ?: throw Error("Network error")

                val fileName = writeFile(bytes)
                promise.resolve(fileName)
            } catch (exception: Exception) {
                promise.reject(exception)
            }
        }
    }

    private fun writeFile(file: ByteArray): String {
        // TODO: consider using cache or cleaning up old files

          val filename = UUID.randomUUID().toString()
          reactApplicationContext.openFileOutput(filename, Context.MODE_PRIVATE).use {
              it.write(file)
          }
          return filename
    }

}
