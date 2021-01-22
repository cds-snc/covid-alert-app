package app.covidshield.utils

object CovidShieldException {

    class UnknownException(cause: Throwable? = null) : Exception("UNKNOWN", cause)

    class ApiNotConnectedException(cause: Throwable) : Exception("API_NOT_CONNECTED", cause)

    class ApiNotEnabledException : Exception("API_NOT_ENABLED")

    class SummaryTokenNotFoundException : IllegalArgumentException("SUMMARY_TOKEN_NOT_FOUND")

    class InvalidActivityException : IllegalArgumentException("INVALID_ACTIVITY")

    class SendIntentException(cause: Throwable) : Exception("SEND_INTENT_EXCEPTION", cause)

    class PermissionDeniedException(cause: Throwable) : Exception("PERMISSION_DENIED", cause)

    class NoResolutionRequiredException(cause: Throwable) : Exception("NO_RESOLUTION_REQUIRED", cause)

    class PlayServicesNotAvailableException : Exception("PLAY_SERVICES_NOT_AVAILABLE")
}