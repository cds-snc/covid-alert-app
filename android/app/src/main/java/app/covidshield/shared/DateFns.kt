package app.covidshield.shared

class DateFns {
    companion object {
        fun getCurrentDate(): Long{
            return System.currentTimeMillis()
        }
    }
}