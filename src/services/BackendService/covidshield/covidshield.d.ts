import * as $protobuf from "protobufjs";
/** Namespace covidshield. */
export namespace covidshield {

    /** Properties of a KeyClaimRequest. */
    interface IKeyClaimRequest {

        /** KeyClaimRequest oneTimeCode */
        oneTimeCode: string;

        /** KeyClaimRequest appPublicKey */
        appPublicKey: Uint8Array;
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
            INVALID_KEY = 4
        }
    }

    /** Properties of an EncryptedUploadRequest. */
    interface IEncryptedUploadRequest {

        /** EncryptedUploadRequest serverPublicKey */
        serverPublicKey: Uint8Array;

        /** EncryptedUploadRequest appPublicKey */
        appPublicKey: Uint8Array;

        /** EncryptedUploadRequest nonce */
        nonce: Uint8Array;

        /** EncryptedUploadRequest payload */
        payload: Uint8Array;
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
        error: covidshield.EncryptedUploadResponse.ErrorCode;
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
            INVALID_ROLLING_START_NUMBER = 12,
            INVALID_TRANSMISSION_RISK_LEVEL = 13
        }
    }

    /** Properties of an Upload. */
    interface IUpload {

        /** Upload timestamp */
        timestamp: google.protobuf.ITimestamp;

        /** Upload keys */
        keys?: (covidshield.IKey[]|null);
    }

    /** Represents an Upload. */
    class Upload implements IUpload {

        /**
         * Constructs a new Upload.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IUpload);

        /** Upload timestamp. */
        public timestamp: google.protobuf.ITimestamp;

        /** Upload keys. */
        public keys: covidshield.IKey[];

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

    /** Properties of a File. */
    interface IFile {

        /** File header */
        header?: (covidshield.IHeader|null);

        /** File key */
        key?: (covidshield.IKey[]|null);
    }

    /** Represents a File. */
    class File implements IFile {

        /**
         * Constructs a new File.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IFile);

        /** File header. */
        public header?: (covidshield.IHeader|null);

        /** File key. */
        public key: covidshield.IKey[];

        /**
         * Creates a new File instance using the specified properties.
         * @param [properties] Properties to set
         * @returns File instance
         */
        public static create(properties?: covidshield.IFile): covidshield.File;

        /**
         * Encodes the specified File message. Does not implicitly {@link covidshield.File.verify|verify} messages.
         * @param message File message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IFile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified File message, length delimited. Does not implicitly {@link covidshield.File.verify|verify} messages.
         * @param message File message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IFile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a File message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns File
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.File;

        /**
         * Decodes a File message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns File
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.File;

        /**
         * Verifies a File message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a File message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns File
         */
        public static fromObject(object: { [k: string]: any }): covidshield.File;

        /**
         * Creates a plain object from a File message. Also converts values to other types if specified.
         * @param message File
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.File, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this File to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Header. */
    interface IHeader {

        /** Header startTimestamp */
        startTimestamp?: (number|Long|null);

        /** Header endTimestamp */
        endTimestamp?: (number|Long|null);

        /** Header region */
        region?: (string|null);

        /** Header batchNum */
        batchNum?: (number|null);

        /** Header batchSize */
        batchSize?: (number|null);
    }

    /** Represents a Header. */
    class Header implements IHeader {

        /**
         * Constructs a new Header.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IHeader);

        /** Header startTimestamp. */
        public startTimestamp: (number|Long);

        /** Header endTimestamp. */
        public endTimestamp: (number|Long);

        /** Header region. */
        public region: string;

        /** Header batchNum. */
        public batchNum: number;

        /** Header batchSize. */
        public batchSize: number;

        /**
         * Creates a new Header instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Header instance
         */
        public static create(properties?: covidshield.IHeader): covidshield.Header;

        /**
         * Encodes the specified Header message. Does not implicitly {@link covidshield.Header.verify|verify} messages.
         * @param message Header message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Header message, length delimited. Does not implicitly {@link covidshield.Header.verify|verify} messages.
         * @param message Header message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Header message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Header
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.Header;

        /**
         * Decodes a Header message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Header
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.Header;

        /**
         * Verifies a Header message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Header message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Header
         */
        public static fromObject(object: { [k: string]: any }): covidshield.Header;

        /**
         * Creates a plain object from a Header message. Also converts values to other types if specified.
         * @param message Header
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.Header, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Header to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Key. */
    interface IKey {

        /** Key keyData */
        keyData?: (Uint8Array|null);

        /** Key rollingStartNumber */
        rollingStartNumber?: (number|null);

        /** Key rollingPeriod */
        rollingPeriod?: (number|null);

        /** Key transmissionRiskLevel */
        transmissionRiskLevel?: (number|null);
    }

    /** Represents a Key. */
    class Key implements IKey {

        /**
         * Constructs a new Key.
         * @param [properties] Properties to set
         */
        constructor(properties?: covidshield.IKey);

        /** Key keyData. */
        public keyData: Uint8Array;

        /** Key rollingStartNumber. */
        public rollingStartNumber: number;

        /** Key rollingPeriod. */
        public rollingPeriod: number;

        /** Key transmissionRiskLevel. */
        public transmissionRiskLevel: number;

        /**
         * Creates a new Key instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Key instance
         */
        public static create(properties?: covidshield.IKey): covidshield.Key;

        /**
         * Encodes the specified Key message. Does not implicitly {@link covidshield.Key.verify|verify} messages.
         * @param message Key message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: covidshield.IKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Key message, length delimited. Does not implicitly {@link covidshield.Key.verify|verify} messages.
         * @param message Key message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: covidshield.IKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Key message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Key
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): covidshield.Key;

        /**
         * Decodes a Key message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Key
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): covidshield.Key;

        /**
         * Verifies a Key message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Key message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Key
         */
        public static fromObject(object: { [k: string]: any }): covidshield.Key;

        /**
         * Creates a plain object from a Key message. Also converts values to other types if specified.
         * @param message Key
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: covidshield.Key, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Key to JSON.
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
    }
}
