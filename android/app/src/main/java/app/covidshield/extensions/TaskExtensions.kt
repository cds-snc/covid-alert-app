package app.covidshield.extensions

import com.facebook.react.bridge.Promise
import com.google.android.gms.tasks.Task

fun <T> Task<T>.bindPromise(promise: Promise, successBlock: Promise.(T) -> Unit) {
    this.addOnFailureListener { promise.reject(it) }
        .addOnSuccessListener {
            try {
                successBlock.invoke(promise, it)
            } catch (exception: Exception) {
                promise.reject(exception)
            }
        }
}

fun <T, R> Task<T>.bindPromise(promise: Promise, failureValue: R, successBlock: Promise.(T) -> Unit) {
    this.addOnFailureListener { promise.resolve(failureValue) }
        .addOnSuccessListener {
            try {
                successBlock.invoke(promise, it)
            } catch (exception: Exception) {
                promise.reject(exception)
            }
        }
}