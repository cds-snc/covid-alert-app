package app.covidshield.extensions

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

fun List<Any>.toWritableArray(): WritableArray {
    return Arguments.fromList(this.toJson().parse(List::class.java))
}

fun Any.toWritableMap(): WritableMap {
    // TODO: convert to map
    return Arguments.createMap()
}