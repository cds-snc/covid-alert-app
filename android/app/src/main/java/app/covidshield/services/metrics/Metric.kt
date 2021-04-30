package app.covidshield.services.metrics

data class Metric(val timestamp: Number, val identifier: String, val region: String, val payload: Map<String, String>)