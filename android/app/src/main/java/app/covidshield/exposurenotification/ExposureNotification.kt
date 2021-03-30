package app.covidshield.exposurenotification

import app.covidshield.shared.DateFns.Companion.getCurrentDate

class ExposureNotification {

    fun main() {

    }

    fun shouldPerformExposureNotificationCheck(): Boolean{
        val today = getCurrentDate()
        val onboardedDatetime: String = ""
        if (onboardedDatetime.isNullOrEmpty()) {
            return false;
        }
        return true;
    }

    fun processPendingExposureSummary(){

    }

    fun getKeysFileUrls(){

    }
}