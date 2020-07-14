package app.covidshield.extensions

import android.util.Log
import app.covidshield.BuildConfig

fun Any.log(message: String?, keyValueMap: Map<String, Any?> = emptyMap(), tag: String = this::class.java.simpleName) {
    if (BuildConfig.DEBUG) {
        Log.d("CovidShield $tag", "$message $keyValueMap".trim())
    }
}
