package app.covidshield.services.exposurenotification
import app.covidshield.exposurenotification.ExposureNotification
import org.junit.Test
import com.google.common.truth.Truth.assertThat

class ExposureNotificationTest {
    @Test
    fun shouldPerformExposureCheck_ReturnsTrue() {
        val exposureNotification = ExposureNotification()
        assertThat(exposureNotification.shouldPerformExposureNotificationCheck()).isTrue()
    }

    @Test
    fun shouldPerformExposureCheck_ReturnsFalse() {
        val exposureNotification = ExposureNotification()
        assertThat(exposureNotification.shouldPerformExposureNotificationCheck()).isFalse()
    }
}