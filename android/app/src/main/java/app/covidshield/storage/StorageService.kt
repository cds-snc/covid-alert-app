package app.covidshield.storage

import android.content.Context
import app.covidshield.utils.SingletonHolder

sealed class KeyDefinition
data class Unsecure(val keyIdentifier: String) : KeyDefinition()
data class Secure(val keyIdentifier: String) : KeyDefinition()

interface StorageService {

    companion object : SingletonHolder<StorageService, Context>(::DefaultStorageService)

    suspend fun save(keyDefinition: KeyDefinition, value: String)
    suspend fun retrieve(keyDefinition: KeyDefinition): String?
    suspend fun delete(keyDefinition: KeyDefinition)
    // Deletes all data from unsecure store only
    suspend fun deleteAll()
}

private class DefaultStorageService constructor(context: Context) : StorageService {

    private val unsecureKeyValueStore: KeyValueStore = UnsecureKeyValueStore(context)
    private val secureKeyValueStore: KeyValueStore = SecureKeyValueStore(context)

    override suspend fun save(keyDefinition: KeyDefinition, value: String) {
        when (keyDefinition) {
            is Unsecure -> this.unsecureKeyValueStore.save(keyDefinition.keyIdentifier, value)
            is Secure -> this.secureKeyValueStore.save(keyDefinition.keyIdentifier, value)
        }
    }

    override suspend fun retrieve(keyDefinition: KeyDefinition): String? {
        return when (keyDefinition) {
            is Unsecure -> this.unsecureKeyValueStore.retrieve(keyDefinition.keyIdentifier)
            is Secure -> this.secureKeyValueStore.retrieve(keyDefinition.keyIdentifier)
        }
    }

    override suspend fun delete(keyDefinition: KeyDefinition) {
        when (keyDefinition) {
            is Unsecure -> this.unsecureKeyValueStore.delete(keyDefinition.keyIdentifier)
            is Secure -> this.secureKeyValueStore.delete(keyDefinition.keyIdentifier)
        }
    }

    override suspend fun deleteAll() {
        this.unsecureKeyValueStore.deleteAll()
    }
}