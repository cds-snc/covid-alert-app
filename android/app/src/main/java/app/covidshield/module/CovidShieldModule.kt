package app.covidshield.module

import android.content.Context
import android.util.Base64
import app.covidshield.extensions.launch
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import okhttp3.CacheControl
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.IOException
import java.security.SecureRandom
import java.util.*
import kotlin.coroutines.CoroutineContext

class CovidShieldModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    private val okHttpClient by lazy { OkHttpClient() }

    override fun getName(): String = "CovidShield"

    override val coroutineContext: CoroutineContext = Dispatchers.IO

    @ReactMethod
    fun getRandomBytes(size: Int, promise: Promise) {
        promise.launch(this) {
            val bytes = SecureRandom().generateSeed(size)
            val base64Encoded = Base64.encodeToString(bytes, Base64.DEFAULT)
            promise.resolve(base64Encoded)
        }
    }

    @Suppress("BlockingMethodInNonBlockingContext")
    @ReactMethod
    fun downloadDiagnosisKeysFile(url: String, promise: Promise) {
        promise.launch(this) {
            val request = Request.Builder()
                .cacheControl(CacheControl.Builder().noStore().build())
                .url(url).build()
            okHttpClient.newCall(request).execute().use { response ->
                if (response.code() != 200) {
                    throw IOException()
                }
                val bytes = response.body()?.bytes() ?: throw IOException()
                val fileName = writeFile(bytes)
                promise.resolve(fileName)
            }
        }
    }

    private fun writeFile(data: ByteArray): String {
        val dirName = UUID.randomUUID().toString()
        val file = File(reactApplicationContext.getDir(dirName, Context.MODE_PRIVATE), "keys.zip")
        file.outputStream().use { it.write(data) }
        return file.absolutePath
    }
}
