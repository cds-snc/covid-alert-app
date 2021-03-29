package app.covidshield.module

import app.covidshield.extensions.launch
import app.covidshield.storage.KeyDefinition
import app.covidshield.storage.Secure
import app.covidshield.storage.StorageService
import app.covidshield.storage.Unsecure
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.CoroutineContext

class StorageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), CoroutineScope {

    override fun getName(): String  = "Storage"
    override val coroutineContext: CoroutineContext = Dispatchers.IO

    private val storageService: StorageService = StorageService.getInstance(reactContext)

    @ReactMethod
    fun save(keyIdentifier: String, inSecureStorage: Boolean, value: String, promise: Promise) {
        promise.launch(this) {
            storageService.save(createKeyDefinition(keyIdentifier, inSecureStorage), value)
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun retrieve(keyIdentifier: String, inSecureStorage: Boolean, promise: Promise) {
        promise.launch(this) {
            val result = storageService.retrieve(createKeyDefinition(keyIdentifier, inSecureStorage))
            promise.resolve(result)
        }
    }

    @ReactMethod
    fun delete(keyIdentifier: String, inSecureStorage: Boolean, promise: Promise) {
        promise.launch(this) {
            storageService.delete(createKeyDefinition(keyIdentifier, inSecureStorage))
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun deleteAll(promise: Promise) {
        promise.launch(this) {
            // For now the `storageService.deleteAll` function will only delete data from the unsecure storage as there is no existing API on the secured one
            storageService.deleteAll()
            promise.resolve(null)
        }
    }

    private fun createKeyDefinition(keyIdentifier: String, isInSecureStorage: Boolean): KeyDefinition {
        return if (isInSecureStorage) Secure(keyIdentifier) else Unsecure(keyIdentifier)
    }
}