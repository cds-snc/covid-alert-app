package app.covidshield.module

import okhttp3.Interceptor
import okhttp3.MediaType
import okhttp3.Response
import okhttp3.ResponseBody
import okhttp3.Call
import okio.*

class DownloadInterceptor(val maxBytes: Long): Interceptor {

    private class ProgressResponseBody(val originalBody: ResponseBody, val call: Call,
                                       val maxBytes: Long): ResponseBody() {

        private var bufferedSource: BufferedSource? = null


        override fun contentLength(): Long {
            return originalBody.contentLength()
        }

        override fun contentType(): MediaType? {
            return originalBody.contentType()
        }

        override fun source(): BufferedSource {
            if(bufferedSource == null) {
                bufferedSource = Okio.buffer(Forwarder(originalBody.source(), call, maxBytes))
            }
            return bufferedSource!!
        }

    }

    private class Forwarder(source: Source, val call: Call, val maxBytes: Long): ForwardingSource(source) {
        private var totalBytesRead: Long = 0

        override fun read(sink: Buffer, byteCount: Long): Long {
            val bytesRead = super.read(sink, byteCount)

            if(bytesRead > 0) totalBytesRead += bytesRead

            if(totalBytesRead > maxBytes && maxBytes > 0) {
                call.cancel()
            }
            return bytesRead
        }
    }

    override fun intercept(chain: Interceptor.Chain): Response {

        val originalResponse = chain.proceed(chain.request())
        val body = originalResponse.body()
        if(body != null) {
            return originalResponse.newBuilder()
                    .body(ProgressResponseBody(body, chain.call(), maxBytes))
                    .build()
        } else {
            return originalResponse
        }
    }
}