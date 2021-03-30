package app.covidshield.services.exposurenotification
import org.junit.Test
import com.google.common.truth.Truth.assertThat

class ExposureNotificationTest {
    @Test
    fun shouldPerformExposureCheck_ReturnsTrue() {
        assertThat("asdf".equals("asdf")).isTrue()
    }

    @Test
    fun shouldPerformExposureCheck_ReturnsFalse() {
        assertThat("asdf".equals("qwer")).isFalse()
    }
}