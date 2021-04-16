package app.covidshield.utils

import java.util.*

object DateUtils {

    fun isSameDay(date1: Date, date2: Date): Boolean {
        val calendar1 = Calendar.getInstance()
        calendar1.time = date1
        val calendar2 = Calendar.getInstance()
        calendar2.time = date2
        val sameYear = calendar1[Calendar.YEAR] == calendar2[Calendar.YEAR]
        val sameMonth = calendar1[Calendar.MONTH] == calendar2[Calendar.MONTH]
        val sameDay = calendar1[Calendar.DAY_OF_MONTH] == calendar2[Calendar.DAY_OF_MONTH]
        return sameDay && sameMonth && sameYear
    }

}