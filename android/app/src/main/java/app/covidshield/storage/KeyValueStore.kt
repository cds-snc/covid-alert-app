package app.covidshield.storage

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.storage.AsyncStorageModule
import com.reactlibrary.securekeystore.RNSecureKeyStoreModule
import java.lang.Exception
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

interface KeyValueStore {
    suspend fun save(key: String, value: String)
    suspend fun retrieve(key: String): String?
    suspend fun delete(key: String)
    suspend fun deleteAll()
}

class UnsecureKeyValueStore(context: Context) : KeyValueStore {

    private val internalStorage = AsyncStorageModule(ReactApplicationContext(context))

    override suspend fun save(key: String, value: String) {
        return suspendCoroutine { coroutineHandler ->
            this.internalStorage.multiSet(createReadableArrayFromKeyValue(key, value)) {
                coroutineHandler.resume(Unit)
            }
        }
    }

    override suspend fun retrieve(key: String): String? {
        return suspendCoroutine { coroutineHandler ->
            this.internalStorage.multiGet(createReadableArrayFromKey(key)) {
                if (it[0] != null) throw Exception("Failed to retrieve data from internal storage (error: ${it[0]})")

                val resultTransformation1 = (it[1] as WritableNativeArray).toArrayList()
                val resultTransformation2 = resultTransformation1.first() as ArrayList<String>
                val result = if (resultTransformation2.count() == 2) resultTransformation2[1] else null

                coroutineHandler.resume(result)
            }
        }
    }

    override suspend fun delete(key: String) {
        return suspendCoroutine { coroutineHandler ->
            this.internalStorage.multiRemove(createReadableArrayFromKey(key)) {
                coroutineHandler.resume(Unit)
            }
        }
    }

    override suspend fun deleteAll() {
        return suspendCoroutine { coroutineHandler ->
            this.internalStorage.clear {
                coroutineHandler.resume(Unit)
            }
        }
    }

    private fun createReadableArrayFromKey(key: String): ReadableArray {
        val array = Arguments.createArray()
        array.pushString(key)
        return array
    }

    private fun createReadableArrayFromKeyValue(key: String, value: String): ReadableArray {
        val array = Arguments.createArray()
        val subArray = Arguments.createArray()
        subArray.pushString(key)
        subArray.pushString(value)
        array.pushArray(subArray)
        return array
    }
}

class SecureKeyValueStore(context: Context) : KeyValueStore {

    private val internalStorage = RNSecureKeyStoreModule(ReactApplicationContext(context))

    override suspend fun save(key: String, value: String) {
        return suspendCoroutine { coroutineHandler ->
            val promise = PromiseImpl({
                coroutineHandler.resume(Unit)
            }, {
                // Callback for error to handle if required
            })
            this.internalStorage.set(key, value, null, promise)
        }
    }

    override suspend fun retrieve(key: String): String? {
        return suspendCoroutine { coroutineHandler ->
            val promise = PromiseImpl({
                val result = it.first() as String
                coroutineHandler.resume(result)
            }, {
                // Callback for error
                coroutineHandler.resume(null)
            })
            this.internalStorage.get(key, promise)
        }
    }

    override suspend fun delete(key: String) {
        return suspendCoroutine { coroutineHandler ->
            val promise = PromiseImpl({
                val result = it.first() as String
                coroutineHandler.resume(Unit)
            }, {
                // Callback for error to handle if required
            })
            this.internalStorage.remove(key, promise)
        }
    }

    override suspend fun deleteAll() {
        return suspendCoroutine { coroutineHandler ->
            // There is no clear function available in RNSecureKeyStore
            coroutineHandler.resume(Unit)
        }
    }
}