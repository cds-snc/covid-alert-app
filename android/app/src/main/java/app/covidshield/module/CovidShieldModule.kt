package app.covidshield.module

import android.content.Context
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
import java.util.*
import kotlin.coroutines.CoroutineContext


class CovidShieldModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), CoroutineScope {

    private val okHttpClient by lazy { OkHttpClient() }

    override fun getName(): String = "CovidShield"

    override val coroutineContext: CoroutineContext = Dispatchers.IO

    @ReactMethod
    fun getRandomBytes(size: Int, promise: Promise) {
        val bytes = SecureRandom().generateSeed(size)
        val base64Encoded = Base64.getEncoder().encodeToString(bytes)
        promise.resolve(base64Encoded)
    }

    @ReactMethod
    fun downloadDiagnosisKeysFiles(url: String, promise: Promise) {
        launch(Dispatchers.IO) {
            var bufferedSource: BufferedSource? = null
            try {
                val request = Request.Builder().url(url).build()
                val response = okHttpClient.newCall(request).execute().takeIf { it.code() == 200 }
                    ?: throw Error("Network error")
                bufferedSource = response.body()?.source() ?: throw Error("Network error")
                val files = mutableListOf<ByteArray>()
                while (true) {
                    val size = bufferedSource.read(4)?.let { BigInteger(it).toInt() } ?: break
                    val file = bufferedSource.read(size) ?: break
                    files.add(file)
                }
                val fileDirs = writeFiles(files)
                promise.resolve(fileDirs.toWritableArray())
            } catch (exception: Exception) {
                promise.reject(exception)
            } finally {
                bufferedSource?.close()
            }
        }
    }

    private fun writeFiles(files: List<ByteArray>): List<String> {
        // TODO: consider using cache or cleaning up old files
        return files.map { file ->
            val filename = UUID.randomUUID().toString()
            reactApplicationContext.openFileOutput(filename, Context.MODE_PRIVATE).use {
                it.write(file)
            }
            filename
        }
    }

    private fun BufferedSource.read(size: Int): ByteArray? {
        return try {
            val byteArray = ByteArray(size)
            readFully(byteArray)
            byteArray
        } catch (_: Exception) {
            null
        }
    }
}
