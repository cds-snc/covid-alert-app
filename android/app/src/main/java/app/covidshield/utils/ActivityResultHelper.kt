package app.covidshield.utils

import android.content.Intent

/**
 * This help won't be necessary when androidx.activity:activity-ktx exposes requestCode
 */
interface ActivityResultHelper {

    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?)
}