package app.covidshield.extensions

import java.io.File

fun File.cleanup() {
    try {
        deleteOnExit()
    } catch (_: Exception) {
    }
}