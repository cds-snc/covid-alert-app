package app.covidshield.utils

import android.annotation.SuppressLint
import android.content.Context
import app.covidshield.MainApplication

private const val TOKEN = "TOKEN"

class PendingTokenManager(private val context: Context) {

    private val sharedPreferences by lazy {
        context.getSharedPreferences("PendingTokenManager", Context.MODE_PRIVATE)
    }

    @SuppressLint("ApplySharedPref")
    fun add(token: String) = synchronized(this) {
        if (token.isBlank()) return@synchronized

        val tokens = sharedPreferences.getStringSet(TOKEN, emptySet()) ?: emptySet()
        val editor = sharedPreferences.edit().apply {
            putStringSet(TOKEN, tokens.toMutableSet().apply { add(token) })
        }
        editor.commit()
    }

    fun retrieve(): List<String> = synchronized(this) {
        val tokens = sharedPreferences.getStringSet(TOKEN, emptySet()) ?: emptySet()
        return tokens.toList()
    }

    fun clear() = synchronized(this) {
        val editor = sharedPreferences.edit().apply { remove(TOKEN) }
        editor.commit()
    }

    companion object {

        val instance by lazy {
            synchronized(PendingTokenManager::class.java) {
                PendingTokenManager(MainApplication.instance)
            }
        }
    }
}