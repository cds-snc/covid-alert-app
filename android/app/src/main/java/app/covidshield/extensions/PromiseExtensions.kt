package app.covidshield.extensions

import com.facebook.react.bridge.Promise

fun Promise.rejectOnException(block: () -> Unit) {
    return try {
        block.invoke()
    } catch (e: Exception) {
        reject(e)
    }
}