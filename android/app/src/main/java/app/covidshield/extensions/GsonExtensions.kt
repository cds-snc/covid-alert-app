package app.covidshield.extensions

import com.google.gson.GsonBuilder

private val GSON = GsonBuilder()
    .create()

fun <T> String?.parse(classOfT: Class<T>): T? {
    return try {
        GSON.fromJson(this, classOfT)
    } catch (e: Exception) {
        null
    }
}

fun Any?.toJson(): String? {
    return try {
        GSON.toJson(this)
    } catch (e: Exception) {
        null
    }
}