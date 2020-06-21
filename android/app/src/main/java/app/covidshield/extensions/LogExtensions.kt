package app.covidshield.extensions

import android.util.Log
import app.covidshield.BuildConfig

fun Any.log(msg: String?, tag: String = this::class.java.simpleName) {
    if (BuildConfig.DEBUG) {
        Log.d(tag, msg)
    }
}
