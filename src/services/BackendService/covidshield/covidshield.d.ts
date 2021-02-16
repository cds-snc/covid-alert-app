import * as $protobuf from "protobufjs";
/** Namespace covidshield. */
export namespace covidshield {

    /** Properties of a KeyClaimRequest. */
    interface IKeyClaimRequest {

        /** KeyClaimRequest oneTimeCode */
        oneTimeCode?: (string|null);

        /** KeyClaimRequest appPublicKey */
        appPublicKey?: (Uint8Array|null);
    }

    /** Represents a KeyClaimRequest. */
    class KeyClaimRequest implements IKeyClaimRequest {

        /**
         * Constructs a new KeyClaimRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IKeyClaimRequest);

        /** KeyClaimRequest oneTimeCode. */
        public oneTimeCode: string;

        /** KeyClaimRequest appPublicKey. */
        public appPublicKey: Uint8Array;

        /**
         * Creates a new KeyClaimRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyClaimRequest instance
         */
        public static create(properties?: covidshield.IKeyClaimRequest): covidshield.KeyClaimRequest;

        /**
         * Encodes the specified KeyClaimRequest message. Does not implicitly {@link covidshield.KeyClaimRequest.verify|verify} messages.
         * @param message KeyClaimRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IKeyClaimRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyClaimRequest message, length delimited. Does not implicitly {@link covidshield.KeyClaimRequest.verify|verify} messages.
         * @param message KeyClaimRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IKeyClaimRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyClaimRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyClaimRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.KeyClaimRequest;

        /**
         * Decodes a KeyClaimRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyClaimRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.KeyClaimRequest;

        /**
         * Verifies a KeyClaimRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyClaimRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyClaimRequest
         */
        public static fromObject(object: { [k: string]: any }): covidshield.KeyClaimRequest;

        /**
         * Creates a plain object from a KeyClaimRequest message. Also converts values to other types if specified.
         * @param message KeyClaimRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.KeyClaimRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyClaimRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KeyClaimResponse. */
    interface IKeyClaimResponse {

        /** KeyClaimResponse error */
        error?: (covidshield.KeyClaimResponse.ErrorCode|null);

        /** KeyClaimResponse serverPublicKey */
        serverPublicKey?: (Uint8Array|null);

        /** KeyClaimResponse triesRemaining */
        triesRemaining?: (number|null);

        /** KeyClaimResponse remainingBanDuration */
        remainingBanDuration?: (google.protobuf.IDuration|null);
    }

    /** Represents a KeyClaimResponse. */
    class KeyClaimResponse implements IKeyClaimResponse {

        /**
         * Constructs a new KeyClaimResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IKeyClaimResponse);

        /** KeyClaimResponse error. */
        public error: covidshield.KeyClaimResponse.ErrorCode;

        /** KeyClaimResponse serverPublicKey. */
        public serverPublicKey: Uint8Array;

        /** KeyClaimResponse triesRemaining. */
        public triesRemaining: number;

        /** KeyClaimResponse remainingBanDuration. */
        public remainingBanDuration?: (google.protobuf.IDuration|null);

        /**
         * Creates a new KeyClaimResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyClaimResponse instance
         */
        public static create(properties?: covidshield.IKeyClaimResponse): covidshield.KeyClaimResponse;

        /**
         * Encodes the specified KeyClaimResponse message. Does not implicitly {@link covidshield.KeyClaimResponse.verify|verify} messages.
         * @param message KeyClaimResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IKeyClaimResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyClaimResponse message, length delimited. Does not implicitly {@link covidshield.KeyClaimResponse.verify|verify} messages.
         * @param message KeyClaimResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IKeyClaimResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyClaimResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyClaimResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.KeyClaimResponse;

        /**
         * Decodes a KeyClaimResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyClaimResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.KeyClaimResponse;

        /**
         * Verifies a KeyClaimResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyClaimResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyClaimResponse
         */
        public static fromObject(object: { [k: string]: any }): covidshield.KeyClaimResponse;

        /**
         * Creates a plain object from a KeyClaimResponse message. Also converts values to other types if specified.
         * @param message KeyClaimResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.KeyClaimResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyClaimResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace KeyClaimResponse {

        /** ErrorCode enum. */
        enum ErrorCode {
            NONE = 0,
            UNKNOWN = 1,
            INVALID_ONE_TIME_CODE = 2,
            SERVER_ERROR = 3,
            INVALID_KEY = 4,
            TEMPORARY_BAN = 5
        }
    }

    /** Properties of an EncryptedUploadRequest. */
    interface IEncryptedUploadRequest {

        /** EncryptedUploadRequest serverPublicKey */
        serverPublicKey?: (Uint8Array|null);

        /** EncryptedUploadRequest appPublicKey */
        appPublicKey?: (Uint8Array|null);

        /** EncryptedUploadRequest nonce */
        nonce?: (Uint8Array|null);

        /** EncryptedUploadRequest payload */
        payload?: (Uint8Array|null);
    }

    /** Represents an EncryptedUploadRequest. */
    class EncryptedUploadRequest implements IEncryptedUploadRequest {

        /**
         * Constructs a new EncryptedUploadRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IEncryptedUploadRequest);

        /** EncryptedUploadRequest serverPublicKey. */
        public serverPublicKey: Uint8Array;

        /** EncryptedUploadRequest appPublicKey. */
        public appPublicKey: Uint8Array;

        /** EncryptedUploadRequest nonce. */
        public nonce: Uint8Array;

        /** EncryptedUploadRequest payload. */
        public payload: Uint8Array;

        /**
         * Creates a new EncryptedUploadRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EncryptedUploadRequest instance
         */
        public static create(properties?: covidshield.IEncryptedUploadRequest): covidshield.EncryptedUploadRequest;

        /**
         * Encodes the specified EncryptedUploadRequest message. Does not implicitly {@link covidshield.EncryptedUploadRequest.verify|verify} messages.
         * @param message EncryptedUploadRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IEncryptedUploadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EncryptedUploadRequest message, length delimited. Does not implicitly {@link covidshield.EncryptedUploadRequest.verify|verify} messages.
         * @param message EncryptedUploadRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IEncryptedUploadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EncryptedUploadRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EncryptedUploadRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.EncryptedUploadRequest;

        /**
         * Decodes an EncryptedUploadRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EncryptedUploadRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.EncryptedUploadRequest;

        /**
         * Verifies an EncryptedUploadRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EncryptedUploadRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EncryptedUploadRequest
         */
        public static fromObject(object: { [k: string]: any }): covidshield.EncryptedUploadRequest;

        /**
         * Creates a plain object from an EncryptedUploadRequest message. Also converts values to other types if specified.
         * @param message EncryptedUploadRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.EncryptedUploadRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EncryptedUploadRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EncryptedUploadResponse. */
    interface IEncryptedUploadResponse {

        /** EncryptedUploadResponse error */
        error?: (covidshield.EncryptedUploadResponse.ErrorCode|null);
    }

    /** Represents an EncryptedUploadResponse. */
    class EncryptedUploadResponse implements IEncryptedUploadResponse {

        /**
         * Constructs a new EncryptedUploadResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IEncryptedUploadResponse);

        /** EncryptedUploadResponse error. */
        public error: covidshield.EncryptedUploadResponse.ErrorCode;

        /**
         * Creates a new EncryptedUploadResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EncryptedUploadResponse instance
         */
        public static create(properties?: covidshield.IEncryptedUploadResponse): covidshield.EncryptedUploadResponse;

        /**
         * Encodes the specified EncryptedUploadResponse message. Does not implicitly {@link covidshield.EncryptedUploadResponse.verify|verify} messages.
         * @param message EncryptedUploadResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IEncryptedUploadResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EncryptedUploadResponse message, length delimited. Does not implicitly {@link covidshield.EncryptedUploadResponse.verify|verify} messages.
         * @param message EncryptedUploadResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IEncryptedUploadResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EncryptedUploadResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EncryptedUploadResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.EncryptedUploadResponse;

        /**
         * Decodes an EncryptedUploadResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EncryptedUploadResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.EncryptedUploadResponse;

        /**
         * Verifies an EncryptedUploadResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EncryptedUploadResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EncryptedUploadResponse
         */
        public static fromObject(object: { [k: string]: any }): covidshield.EncryptedUploadResponse;

        /**
         * Creates a plain object from an EncryptedUploadResponse message. Also converts values to other types if specified.
         * @param message EncryptedUploadResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.EncryptedUploadResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EncryptedUploadResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace EncryptedUploadResponse {

        /** ErrorCode enum. */
        enum ErrorCode {
            NONE = 0,
            UNKNOWN = 1,
            INVALID_KEYPAIR = 2,
            DECRYPTION_FAILED = 3,
            INVALID_PAYLOAD = 4,
            SERVER_ERROR = 5,
            INVALID_CRYPTO_PARAMETERS = 6,
            TOO_MANY_KEYS = 7,
            INVALID_TIMESTAMP = 8,
            INVALID_ROLLING_PERIOD = 10,
            INVALID_KEY_DATA = 11,
            INVALID_ROLLING_START_INTERVAL_NUMBER = 12,
            INVALID_TRANSMISSION_RISK_LEVEL = 13,
            NO_KEYS_IN_PAYLOAD = 14
        }
    }

    /** Properties of an OutbreakEvent. */
    interface IOutbreakEvent {

        /** OutbreakEvent locationId */
        locationId?: (string|null);

        /** OutbreakEvent startTime */
        startTime?: (google.protobuf.ITimestamp|null);

        /** OutbreakEvent endTime */
        endTime?: (google.protobuf.ITimestamp|null);
    }

    /** Represents an OutbreakEvent. */
    class OutbreakEvent implements IOutbreakEvent {

        /**
         * Constructs a new OutbreakEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IOutbreakEvent);

        /** OutbreakEvent locationId. */
        public locationId: string;

        /** OutbreakEvent startTime. */
        public startTime?: (google.protobuf.ITimestamp|null);

        /** OutbreakEvent endTime. */
        public endTime?: (google.protobuf.ITimestamp|null);

        /**
         * Creates a new OutbreakEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OutbreakEvent instance
         */
        public static create(properties?: covidshield.IOutbreakEvent): covidshield.OutbreakEvent;

        /**
         * Encodes the specified OutbreakEvent message. Does not implicitly {@link covidshield.OutbreakEvent.verify|verify} messages.
         * @param message OutbreakEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IOutbreakEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OutbreakEvent message, length delimited. Does not implicitly {@link covidshield.OutbreakEvent.verify|verify} messages.
         * @param message OutbreakEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IOutbreakEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OutbreakEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OutbreakEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.OutbreakEvent;

        /**
         * Decodes an OutbreakEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OutbreakEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.OutbreakEvent;

        /**
         * Verifies an OutbreakEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OutbreakEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OutbreakEvent
         */
        public static fromObject(object: { [k: string]: any }): covidshield.OutbreakEvent;

        /**
         * Creates a plain object from an OutbreakEvent message. Also converts values to other types if specified.
         * @param message OutbreakEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.OutbreakEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OutbreakEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OutbreakEventResponse. */
    interface IOutbreakEventResponse {

        /** OutbreakEventResponse error */
        error?: (covidshield.OutbreakEventResponse.ErrorCode|null);
    }

    /** Represents an OutbreakEventResponse. */
    class OutbreakEventResponse implements IOutbreakEventResponse {

        /**
         * Constructs a new OutbreakEventResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IOutbreakEventResponse);

        /** OutbreakEventResponse error. */
        public error: covidshield.OutbreakEventResponse.ErrorCode;

        /**
         * Creates a new OutbreakEventResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OutbreakEventResponse instance
         */
        public static create(properties?: covidshield.IOutbreakEventResponse): covidshield.OutbreakEventResponse;

        /**
         * Encodes the specified OutbreakEventResponse message. Does not implicitly {@link covidshield.OutbreakEventResponse.verify|verify} messages.
         * @param message OutbreakEventResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IOutbreakEventResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OutbreakEventResponse message, length delimited. Does not implicitly {@link covidshield.OutbreakEventResponse.verify|verify} messages.
         * @param message OutbreakEventResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IOutbreakEventResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OutbreakEventResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OutbreakEventResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.OutbreakEventResponse;

        /**
         * Decodes an OutbreakEventResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OutbreakEventResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.OutbreakEventResponse;

        /**
         * Verifies an OutbreakEventResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OutbreakEventResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OutbreakEventResponse
         */
        public static fromObject(object: { [k: string]: any }): covidshield.OutbreakEventResponse;

        /**
         * Creates a plain object from an OutbreakEventResponse message. Also converts values to other types if specified.
         * @param message OutbreakEventResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.OutbreakEventResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OutbreakEventResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace OutbreakEventResponse {

        /** ErrorCode enum. */
        enum ErrorCode {
            NONE = 0,
            UNKNOWN = 1,
            INVALID_ID = 2,
            MISSING_TIMESTAMP = 3,
            PERIOD_INVALID = 4,
            SERVER_ERROR = 5
        }
    }

    /** Properties of an OutbreakEventExport. */
    interface IOutbreakEventExport {

        /** OutbreakEventExport startTimestamp */
        startTimestamp?: (number|Long|null);

        /** OutbreakEventExport endTimestamp */
        endTimestamp?: (number|Long|null);

        /** OutbreakEventExport locations */
        locations?: (covidshield.IOutbreakEvent[]|null);
    }

    /** Represents an OutbreakEventExport. */
    class OutbreakEventExport implements IOutbreakEventExport {

        /**
         * Constructs a new OutbreakEventExport.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IOutbreakEventExport);

        /** OutbreakEventExport startTimestamp. */
        public startTimestamp: (number|Long);

        /** OutbreakEventExport endTimestamp. */
        public endTimestamp: (number|Long);

        /** OutbreakEventExport locations. */
        public locations: covidshield.IOutbreakEvent[];

        /**
         * Creates a new OutbreakEventExport instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OutbreakEventExport instance
         */
        public static create(properties?: covidshield.IOutbreakEventExport): covidshield.OutbreakEventExport;

        /**
         * Encodes the specified OutbreakEventExport message. Does not implicitly {@link covidshield.OutbreakEventExport.verify|verify} messages.
         * @param message OutbreakEventExport message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IOutbreakEventExport, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OutbreakEventExport message, length delimited. Does not implicitly {@link covidshield.OutbreakEventExport.verify|verify} messages.
         * @param message OutbreakEventExport message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IOutbreakEventExport, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OutbreakEventExport message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OutbreakEventExport
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.OutbreakEventExport;

        /**
         * Decodes an OutbreakEventExport message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OutbreakEventExport
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.OutbreakEventExport;

        /**
         * Verifies an OutbreakEventExport message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OutbreakEventExport message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OutbreakEventExport
         */
        public static fromObject(object: { [k: string]: any }): covidshield.OutbreakEventExport;

        /**
         * Creates a plain object from an OutbreakEventExport message. Also converts values to other types if specified.
         * @param message OutbreakEventExport
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.OutbreakEventExport, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OutbreakEventExport to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OutbreakEventExportSignature. */
    interface IOutbreakEventExportSignature {

        /** OutbreakEventExportSignature signature */
        signature?: (Uint8Array|null);
    }

    /** Represents an OutbreakEventExportSignature. */
    class OutbreakEventExportSignature implements IOutbreakEventExportSignature {

        /**
         * Constructs a new OutbreakEventExportSignature.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IOutbreakEventExportSignature);

        /** OutbreakEventExportSignature signature. */
        public signature: Uint8Array;

        /**
         * Creates a new OutbreakEventExportSignature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OutbreakEventExportSignature instance
         */
        public static create(properties?: covidshield.IOutbreakEventExportSignature): covidshield.OutbreakEventExportSignature;

        /**
         * Encodes the specified OutbreakEventExportSignature message. Does not implicitly {@link covidshield.OutbreakEventExportSignature.verify|verify} messages.
         * @param message OutbreakEventExportSignature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IOutbreakEventExportSignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OutbreakEventExportSignature message, length delimited. Does not implicitly {@link covidshield.OutbreakEventExportSignature.verify|verify} messages.
         * @param message OutbreakEventExportSignature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IOutbreakEventExportSignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OutbreakEventExportSignature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OutbreakEventExportSignature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.OutbreakEventExportSignature;

        /**
         * Decodes an OutbreakEventExportSignature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OutbreakEventExportSignature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.OutbreakEventExportSignature;

        /**
         * Verifies an OutbreakEventExportSignature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OutbreakEventExportSignature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OutbreakEventExportSignature
         */
        public static fromObject(object: { [k: string]: any }): covidshield.OutbreakEventExportSignature;

        /**
         * Creates a plain object from an OutbreakEventExportSignature message. Also converts values to other types if specified.
         * @param message OutbreakEventExportSignature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.OutbreakEventExportSignature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OutbreakEventExportSignature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Upload. */
    interface IUpload {

        /** Upload timestamp */
        timestamp?: (google.protobuf.ITimestamp|null);

        /** Upload keys */
        keys?: (covidshield.ITemporaryExposureKey[]|null);
    }

    /** Represents an Upload. */
    class Upload implements IUpload {

        /**
         * Constructs a new Upload.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IUpload);

        /** Upload timestamp. */
        public timestamp?: (google.protobuf.ITimestamp|null);

        /** Upload keys. */
        public keys: covidshield.ITemporaryExposureKey[];

        /**
         * Creates a new Upload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Upload instance
         */
        public static create(properties?: covidshield.IUpload): covidshield.Upload;

        /**
         * Encodes the specified Upload message. Does not implicitly {@link covidshield.Upload.verify|verify} messages.
         * @param message Upload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IUpload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Upload message, length delimited. Does not implicitly {@link covidshield.Upload.verify|verify} messages.
         * @param message Upload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IUpload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Upload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Upload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.Upload;

        /**
         * Decodes an Upload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Upload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.Upload;

        /**
         * Verifies an Upload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Upload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Upload
         */
        public static fromObject(object: { [k: string]: any }): covidshield.Upload;

        /**
         * Creates a plain object from an Upload message. Also converts values to other types if specified.
         * @param message Upload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.Upload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Upload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TemporaryExposureKeyExport. */
    interface ITemporaryExposureKeyExport {

        /** TemporaryExposureKeyExport startTimestamp */
        startTimestamp?: (number|Long|null);

        /** TemporaryExposureKeyExport endTimestamp */
        endTimestamp?: (number|Long|null);

        /** TemporaryExposureKeyExport region */
        region?: (string|null);

        /** TemporaryExposureKeyExport batchNum */
        batchNum?: (number|null);

        /** TemporaryExposureKeyExport batchSize */
        batchSize?: (number|null);

        /** TemporaryExposureKeyExport signatureInfos */
        signatureInfos?: (covidshield.ISignatureInfo[]|null);

        /** TemporaryExposureKeyExport keys */
        keys?: (covidshield.ITemporaryExposureKey[]|null);

        /** TemporaryExposureKeyExport revisedKeys */
        revisedKeys?: (covidshield.ITemporaryExposureKey[]|null);
    }

    /** Represents a TemporaryExposureKeyExport. */
    class TemporaryExposureKeyExport implements ITemporaryExposureKeyExport {

        /**
         * Constructs a new TemporaryExposureKeyExport.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.ITemporaryExposureKeyExport);

        /** TemporaryExposureKeyExport startTimestamp. */
        public startTimestamp: (number|Long);

        /** TemporaryExposureKeyExport endTimestamp. */
        public endTimestamp: (number|Long);

        /** TemporaryExposureKeyExport region. */
        public region: string;

        /** TemporaryExposureKeyExport batchNum. */
        public batchNum: number;

        /** TemporaryExposureKeyExport batchSize. */
        public batchSize: number;

        /** TemporaryExposureKeyExport signatureInfos. */
        public signatureInfos: covidshield.ISignatureInfo[];

        /** TemporaryExposureKeyExport keys. */
        public keys: covidshield.ITemporaryExposureKey[];

        /** TemporaryExposureKeyExport revisedKeys. */
        public revisedKeys: covidshield.ITemporaryExposureKey[];

        /**
         * Creates a new TemporaryExposureKeyExport instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TemporaryExposureKeyExport instance
         */
        public static create(properties?: covidshield.ITemporaryExposureKeyExport): covidshield.TemporaryExposureKeyExport;

        /**
         * Encodes the specified TemporaryExposureKeyExport message. Does not implicitly {@link covidshield.TemporaryExposureKeyExport.verify|verify} messages.
         * @param message TemporaryExposureKeyExport message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.ITemporaryExposureKeyExport, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TemporaryExposureKeyExport message, length delimited. Does not implicitly {@link covidshield.TemporaryExposureKeyExport.verify|verify} messages.
         * @param message TemporaryExposureKeyExport message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.ITemporaryExposureKeyExport, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TemporaryExposureKeyExport message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TemporaryExposureKeyExport
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.TemporaryExposureKeyExport;

        /**
         * Decodes a TemporaryExposureKeyExport message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TemporaryExposureKeyExport
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.TemporaryExposureKeyExport;

        /**
         * Verifies a TemporaryExposureKeyExport message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TemporaryExposureKeyExport message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TemporaryExposureKeyExport
         */
        public static fromObject(object: { [k: string]: any }): covidshield.TemporaryExposureKeyExport;

        /**
         * Creates a plain object from a TemporaryExposureKeyExport message. Also converts values to other types if specified.
         * @param message TemporaryExposureKeyExport
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.TemporaryExposureKeyExport, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TemporaryExposureKeyExport to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SignatureInfo. */
    interface ISignatureInfo {

        /** SignatureInfo verificationKeyVersion */
        verificationKeyVersion?: (string|null);

        /** SignatureInfo verificationKeyId */
        verificationKeyId?: (string|null);

        /** SignatureInfo signatureAlgorithm */
        signatureAlgorithm?: (string|null);
    }

    /** Represents a SignatureInfo. */
    class SignatureInfo implements ISignatureInfo {

        /**
         * Constructs a new SignatureInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.ISignatureInfo);

        /** SignatureInfo verificationKeyVersion. */
        public verificationKeyVersion: string;

        /** SignatureInfo verificationKeyId. */
        public verificationKeyId: string;

        /** SignatureInfo signatureAlgorithm. */
        public signatureAlgorithm: string;

        /**
         * Creates a new SignatureInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SignatureInfo instance
         */
        public static create(properties?: covidshield.ISignatureInfo): covidshield.SignatureInfo;

        /**
         * Encodes the specified SignatureInfo message. Does not implicitly {@link covidshield.SignatureInfo.verify|verify} messages.
         * @param message SignatureInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.ISignatureInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SignatureInfo message, length delimited. Does not implicitly {@link covidshield.SignatureInfo.verify|verify} messages.
         * @param message SignatureInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.ISignatureInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SignatureInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SignatureInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.SignatureInfo;

        /**
         * Decodes a SignatureInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SignatureInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.SignatureInfo;

        /**
         * Verifies a SignatureInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SignatureInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SignatureInfo
         */
        public static fromObject(object: { [k: string]: any }): covidshield.SignatureInfo;

        /**
         * Creates a plain object from a SignatureInfo message. Also converts values to other types if specified.
         * @param message SignatureInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.SignatureInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SignatureInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TemporaryExposureKey. */
    interface ITemporaryExposureKey {

        /** TemporaryExposureKey keyData */
        keyData?: (Uint8Array|null);

        /** TemporaryExposureKey transmissionRiskLevel */
        transmissionRiskLevel?: (number|null);

        /** TemporaryExposureKey rollingStartIntervalNumber */
        rollingStartIntervalNumber?: (number|null);

        /** TemporaryExposureKey rollingPeriod */
        rollingPeriod?: (number|null);

        /** TemporaryExposureKey reportType */
        reportType?: (covidshield.TemporaryExposureKey.ReportType|null);

        /** TemporaryExposureKey daysSinceOnsetOfSymptoms */
        daysSinceOnsetOfSymptoms?: (number|null);
    }

    /** Represents a TemporaryExposureKey. */
    class TemporaryExposureKey implements ITemporaryExposureKey {

        /**
         * Constructs a new TemporaryExposureKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.ITemporaryExposureKey);

        /** TemporaryExposureKey keyData. */
        public keyData: Uint8Array;

        /** TemporaryExposureKey transmissionRiskLevel. */
        public transmissionRiskLevel: number;

        /** TemporaryExposureKey rollingStartIntervalNumber. */
        public rollingStartIntervalNumber: number;

        /** TemporaryExposureKey rollingPeriod. */
        public rollingPeriod: number;

        /** TemporaryExposureKey reportType. */
        public reportType: covidshield.TemporaryExposureKey.ReportType;

        /** TemporaryExposureKey daysSinceOnsetOfSymptoms. */
        public daysSinceOnsetOfSymptoms: number;

        /**
         * Creates a new TemporaryExposureKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TemporaryExposureKey instance
         */
        public static create(properties?: covidshield.ITemporaryExposureKey): covidshield.TemporaryExposureKey;

        /**
         * Encodes the specified TemporaryExposureKey message. Does not implicitly {@link covidshield.TemporaryExposureKey.verify|verify} messages.
         * @param message TemporaryExposureKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.ITemporaryExposureKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TemporaryExposureKey message, length delimited. Does not implicitly {@link covidshield.TemporaryExposureKey.verify|verify} messages.
         * @param message TemporaryExposureKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.ITemporaryExposureKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TemporaryExposureKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TemporaryExposureKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.TemporaryExposureKey;

        /**
         * Decodes a TemporaryExposureKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TemporaryExposureKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.TemporaryExposureKey;

        /**
         * Verifies a TemporaryExposureKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TemporaryExposureKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TemporaryExposureKey
         */
        public static fromObject(object: { [k: string]: any }): covidshield.TemporaryExposureKey;

        /**
         * Creates a plain object from a TemporaryExposureKey message. Also converts values to other types if specified.
         * @param message TemporaryExposureKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.TemporaryExposureKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TemporaryExposureKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace TemporaryExposureKey {

        /** ReportType enum. */
        enum ReportType {
            UNKNOWN = 0,
            CONFIRMED_TEST = 1,
            CONFIRMED_CLINICAL_DIAGNOSIS = 2,
            SELF_REPORT = 3,
            RECURSIVE = 4,
            REVOKED = 5
        }
    }

    /** Properties of a TEKSignatureList. */
    interface ITEKSignatureList {

        /** TEKSignatureList signatures */
        signatures?: (covidshield.ITEKSignature[]|null);
    }

    /** Represents a TEKSignatureList. */
    class TEKSignatureList implements ITEKSignatureList {

        /**
         * Constructs a new TEKSignatureList.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.ITEKSignatureList);

        /** TEKSignatureList signatures. */
        public signatures: covidshield.ITEKSignature[];

        /**
         * Creates a new TEKSignatureList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TEKSignatureList instance
         */
        public static create(properties?: covidshield.ITEKSignatureList): covidshield.TEKSignatureList;

        /**
         * Encodes the specified TEKSignatureList message. Does not implicitly {@link covidshield.TEKSignatureList.verify|verify} messages.
         * @param message TEKSignatureList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.ITEKSignatureList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TEKSignatureList message, length delimited. Does not implicitly {@link covidshield.TEKSignatureList.verify|verify} messages.
         * @param message TEKSignatureList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.ITEKSignatureList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TEKSignatureList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TEKSignatureList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.TEKSignatureList;

        /**
         * Decodes a TEKSignatureList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TEKSignatureList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.TEKSignatureList;

        /**
         * Verifies a TEKSignatureList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TEKSignatureList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TEKSignatureList
         */
        public static fromObject(object: { [k: string]: any }): covidshield.TEKSignatureList;

        /**
         * Creates a plain object from a TEKSignatureList message. Also converts values to other types if specified.
         * @param message TEKSignatureList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.TEKSignatureList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TEKSignatureList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TEKSignature. */
    interface ITEKSignature {

        /** TEKSignature signatureInfo */
        signatureInfo?: (covidshield.ISignatureInfo|null);

        /** TEKSignature batchNum */
        batchNum?: (number|null);

        /** TEKSignature batchSize */
        batchSize?: (number|null);

        /** TEKSignature signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a TEKSignature. */
    class TEKSignature implements ITEKSignature {

        /**
         * Constructs a new TEKSignature.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.ITEKSignature);

        /** TEKSignature signatureInfo. */
        public signatureInfo?: (covidshield.ISignatureInfo|null);

        /** TEKSignature batchNum. */
        public batchNum: number;

        /** TEKSignature batchSize. */
        public batchSize: number;

        /** TEKSignature signature. */
        public signature: Uint8Array;

        /**
         * Creates a new TEKSignature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TEKSignature instance
         */
        public static create(properties?: covidshield.ITEKSignature): covidshield.TEKSignature;

        /**
         * Encodes the specified TEKSignature message. Does not implicitly {@link covidshield.TEKSignature.verify|verify} messages.
         * @param message TEKSignature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.ITEKSignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TEKSignature message, length delimited. Does not implicitly {@link covidshield.TEKSignature.verify|verify} messages.
         * @param message TEKSignature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.ITEKSignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TEKSignature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TEKSignature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.TEKSignature;

        /**
         * Decodes a TEKSignature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TEKSignature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.TEKSignature;

        /**
         * Verifies a TEKSignature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TEKSignature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TEKSignature
         */
        public static fromObject(object: { [k: string]: any }): covidshield.TEKSignature;

        /**
         * Creates a plain object from a TEKSignature message. Also converts values to other types if specified.
         * @param message TEKSignature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.TEKSignature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TEKSignature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Duration. */
        interface IDuration {

            /** Duration seconds */
            seconds?: (number|Long|null);

            /** Duration nanos */
            nanos?: (number|null);
        }

        /** Represents a Duration. */
        class Duration implements IDuration {

            /**
             * Constructs a new Duration.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDuration);

            /** Duration seconds. */
            public seconds: (number|Long);

            /** Duration nanos. */
            public nanos: number;

            /**
             * Creates a new Duration instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Duration instance
             */
            public static create(properties?: google.protobuf.IDuration): google.protobuf.Duration;

            /**
             * Encodes the specified Duration message. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Duration message, length delimited. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Duration message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Duration;

            /**
             * Decodes a Duration message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Duration;

            /**
             * Verifies a Duration message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Duration message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Duration
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Duration;

            /**
             * Creates a plain object from a Duration message. Also converts values to other types if specified.
             * @param message Duration
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Duration, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Duration to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
