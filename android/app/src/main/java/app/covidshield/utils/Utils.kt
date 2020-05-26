package app.covidshield.utils

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

@Throws(JSONException::class)
fun convertJsonToMap(jsonObject: JSONObject): WritableMap? {
    val map: WritableMap = WritableNativeMap()
    val iterator = jsonObject.keys()
    while (iterator.hasNext()) {
        val key = iterator.next()
        when (val value = jsonObject[key]) {
            is JSONObject -> {
                map.putMap(key, convertJsonToMap(value))
            }
            is JSONArray -> {
                map.putArray(key, convertJsonToArray(value))
            }
            is Boolean -> {
                map.putBoolean(key, value)
            }
            is Int -> {
                map.putInt(key, value)
            }
            is Double -> {
                map.putDouble(key, value)
            }
            is String -> {
                map.putString(key, value)
            }
            else -> {
                map.putString(key, value.toString())
            }
        }
    }
    return map
}

@Throws(JSONException::class)
fun convertJsonToArray(jsonArray: JSONArray): WritableArray? {
    val array: WritableArray = WritableNativeArray()
    for (i in 0 until jsonArray.length()) {
        when (val value = jsonArray[i]) {
            is JSONObject -> {
                array.pushMap(convertJsonToMap(value))
            }
            is JSONArray -> {
                array.pushArray(convertJsonToArray(value))
            }
            is Boolean -> {
                array.pushBoolean(value)
            }
            is Int -> {
                array.pushInt(value)
            }
            is Double -> {
                array.pushDouble(value)
            }
            is String -> {
                array.pushString(value)
            }
            else -> {
                array.pushString(value.toString())
            }
        }
    }
    return array
}

@Throws(JSONException::class)
fun convertMapToJson(readableMap: ReadableMap?): JSONObject? {
    if (readableMap == null) {
        return null
    }
    val jsonObject = JSONObject()
    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        when (readableMap.getType(key)) {
            ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
            ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
            ReadableType.Number -> jsonObject.put(key, readableMap.getDouble(key))
            ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
            ReadableType.Map -> jsonObject.put(key, convertMapToJson(readableMap.getMap(key)))
            ReadableType.Array -> jsonObject.put(key, convertArrayToJson(readableMap.getArray(key)))
        }
    }
    return jsonObject
}

@Throws(JSONException::class)
fun convertArrayToJson(readableArray: ReadableArray?): JSONArray? {
    val array = JSONArray()
    for (i in 0 until readableArray!!.size()) {
        when (readableArray.getType(i)) {
            ReadableType.Null -> {
            }
            ReadableType.Boolean -> array.put(readableArray.getBoolean(i))
            ReadableType.Number -> array.put(readableArray.getDouble(i))
            ReadableType.String -> array.put(readableArray.getString(i))
            ReadableType.Map -> array.put(convertMapToJson(readableArray.getMap(i)))
            ReadableType.Array -> array.put(convertArrayToJson(readableArray.getArray(i)))
        }
    }
    return array
}