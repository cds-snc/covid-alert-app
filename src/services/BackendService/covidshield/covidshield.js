/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.covidshield = (function() {
    
        /**
         * Namespace covidshield.
         * @exports covidshield
         * @namespace
         */
        var covidshield = {};
    
        covidshield.KeyClaimRequest = (function() {
    
            /**
             * Properties of a KeyClaimRequest.
             * @memberof covidshield
             * @interface IKeyClaimRequest
             * @property {string} oneTimeCode KeyClaimRequest oneTimeCode
             * @property {Uint8Array} appPublicKey KeyClaimRequest appPublicKey
             */
    
            /**
             * Constructs a new KeyClaimRequest.
             * @memberof covidshield
             * @classdesc Represents a KeyClaimRequest.
             * @implements IKeyClaimRequest
             * @constructor
             * @param {covidshield.IKeyClaimRequest=} [properties] Properties to set
             */
            function KeyClaimRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * KeyClaimRequest oneTimeCode.
             * @member {string} oneTimeCode
             * @memberof covidshield.KeyClaimRequest
             * @instance
             */
            KeyClaimRequest.prototype.oneTimeCode = "";
    
            /**
             * KeyClaimRequest appPublicKey.
             * @member {Uint8Array} appPublicKey
             * @memberof covidshield.KeyClaimRequest
             * @instance
             */
            KeyClaimRequest.prototype.appPublicKey = $util.newBuffer([]);
    
            /**
             * Creates a new KeyClaimRequest instance using the specified properties.
             * @function create
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {covidshield.IKeyClaimRequest=} [properties] Properties to set
             * @returns {covidshield.KeyClaimRequest} KeyClaimRequest instance
             */
            KeyClaimRequest.create = function create(properties) {
                return new KeyClaimRequest(properties);
            };
    
            /**
             * Encodes the specified KeyClaimRequest message. Does not implicitly {@link covidshield.KeyClaimRequest.verify|verify} messages.
             * @function encode
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {covidshield.IKeyClaimRequest} message KeyClaimRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyClaimRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.oneTimeCode);
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.appPublicKey);
                return writer;
            };
    
            /**
             * Encodes the specified KeyClaimRequest message, length delimited. Does not implicitly {@link covidshield.KeyClaimRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {covidshield.IKeyClaimRequest} message KeyClaimRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyClaimRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a KeyClaimRequest message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.KeyClaimRequest} KeyClaimRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyClaimRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.KeyClaimRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.oneTimeCode = reader.string();
                        break;
                    case 2:
                        message.appPublicKey = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("oneTimeCode"))
                    throw $util.ProtocolError("missing required 'oneTimeCode'", { instance: message });
                if (!message.hasOwnProperty("appPublicKey"))
                    throw $util.ProtocolError("missing required 'appPublicKey'", { instance: message });
                return message;
            };
    
            /**
             * Decodes a KeyClaimRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.KeyClaimRequest} KeyClaimRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyClaimRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a KeyClaimRequest message.
             * @function verify
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyClaimRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isString(message.oneTimeCode))
                    return "oneTimeCode: string expected";
                if (!(message.appPublicKey && typeof message.appPublicKey.length === "number" || $util.isString(message.appPublicKey)))
                    return "appPublicKey: buffer expected";
                return null;
            };
    
            /**
             * Creates a KeyClaimRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.KeyClaimRequest} KeyClaimRequest
             */
            KeyClaimRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.KeyClaimRequest)
                    return object;
                var message = new $root.covidshield.KeyClaimRequest();
                if (object.oneTimeCode != null)
                    message.oneTimeCode = String(object.oneTimeCode);
                if (object.appPublicKey != null)
                    if (typeof object.appPublicKey === "string")
                        $util.base64.decode(object.appPublicKey, message.appPublicKey = $util.newBuffer($util.base64.length(object.appPublicKey)), 0);
                    else if (object.appPublicKey.length)
                        message.appPublicKey = object.appPublicKey;
                return message;
            };
    
            /**
             * Creates a plain object from a KeyClaimRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.KeyClaimRequest
             * @static
             * @param {covidshield.KeyClaimRequest} message KeyClaimRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyClaimRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.oneTimeCode = "";
                    if (options.bytes === String)
                        object.appPublicKey = "";
                    else {
                        object.appPublicKey = [];
                        if (options.bytes !== Array)
                            object.appPublicKey = $util.newBuffer(object.appPublicKey);
                    }
                }
                if (message.oneTimeCode != null && message.hasOwnProperty("oneTimeCode"))
                    object.oneTimeCode = message.oneTimeCode;
                if (message.appPublicKey != null && message.hasOwnProperty("appPublicKey"))
                    object.appPublicKey = options.bytes === String ? $util.base64.encode(message.appPublicKey, 0, message.appPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.appPublicKey) : message.appPublicKey;
                return object;
            };
    
            /**
             * Converts this KeyClaimRequest to JSON.
             * @function toJSON
             * @memberof covidshield.KeyClaimRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyClaimRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return KeyClaimRequest;
        })();
    
        covidshield.KeyClaimResponse = (function() {
    
            /**
             * Properties of a KeyClaimResponse.
             * @memberof covidshield
             * @interface IKeyClaimResponse
             * @property {covidshield.KeyClaimResponse.ErrorCode|null} [error] KeyClaimResponse error
             * @property {Uint8Array|null} [serverPublicKey] KeyClaimResponse serverPublicKey
             * @property {number|null} [triesRemaining] KeyClaimResponse triesRemaining
             * @property {google.protobuf.IDuration|null} [remainingBanDuration] KeyClaimResponse remainingBanDuration
             */
    
            /**
             * Constructs a new KeyClaimResponse.
             * @memberof covidshield
             * @classdesc Represents a KeyClaimResponse.
             * @implements IKeyClaimResponse
             * @constructor
             * @param {covidshield.IKeyClaimResponse=} [properties] Properties to set
             */
            function KeyClaimResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * KeyClaimResponse error.
             * @member {covidshield.KeyClaimResponse.ErrorCode} error
             * @memberof covidshield.KeyClaimResponse
             * @instance
             */
            KeyClaimResponse.prototype.error = 0;
    
            /**
             * KeyClaimResponse serverPublicKey.
             * @member {Uint8Array} serverPublicKey
             * @memberof covidshield.KeyClaimResponse
             * @instance
             */
            KeyClaimResponse.prototype.serverPublicKey = $util.newBuffer([]);
    
            /**
             * KeyClaimResponse triesRemaining.
             * @member {number} triesRemaining
             * @memberof covidshield.KeyClaimResponse
             * @instance
             */
            KeyClaimResponse.prototype.triesRemaining = 0;
    
            /**
             * KeyClaimResponse remainingBanDuration.
             * @member {google.protobuf.IDuration|null|undefined} remainingBanDuration
             * @memberof covidshield.KeyClaimResponse
             * @instance
             */
            KeyClaimResponse.prototype.remainingBanDuration = null;
    
            /**
             * Creates a new KeyClaimResponse instance using the specified properties.
             * @function create
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {covidshield.IKeyClaimResponse=} [properties] Properties to set
             * @returns {covidshield.KeyClaimResponse} KeyClaimResponse instance
             */
            KeyClaimResponse.create = function create(properties) {
                return new KeyClaimResponse(properties);
            };
    
            /**
             * Encodes the specified KeyClaimResponse message. Does not implicitly {@link covidshield.KeyClaimResponse.verify|verify} messages.
             * @function encode
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {covidshield.IKeyClaimResponse} message KeyClaimResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyClaimResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.error);
                if (message.serverPublicKey != null && Object.hasOwnProperty.call(message, "serverPublicKey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.serverPublicKey);
                if (message.triesRemaining != null && Object.hasOwnProperty.call(message, "triesRemaining"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.triesRemaining);
                if (message.remainingBanDuration != null && Object.hasOwnProperty.call(message, "remainingBanDuration"))
                    $root.google.protobuf.Duration.encode(message.remainingBanDuration, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified KeyClaimResponse message, length delimited. Does not implicitly {@link covidshield.KeyClaimResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {covidshield.IKeyClaimResponse} message KeyClaimResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyClaimResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a KeyClaimResponse message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.KeyClaimResponse} KeyClaimResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyClaimResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.KeyClaimResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.error = reader.int32();
                        break;
                    case 2:
                        message.serverPublicKey = reader.bytes();
                        break;
                    case 3:
                        message.triesRemaining = reader.uint32();
                        break;
                    case 4:
                        message.remainingBanDuration = $root.google.protobuf.Duration.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a KeyClaimResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.KeyClaimResponse} KeyClaimResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyClaimResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a KeyClaimResponse message.
             * @function verify
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyClaimResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.error != null && message.hasOwnProperty("error"))
                    switch (message.error) {
                    default:
                        return "error: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
                if (message.serverPublicKey != null && message.hasOwnProperty("serverPublicKey"))
                    if (!(message.serverPublicKey && typeof message.serverPublicKey.length === "number" || $util.isString(message.serverPublicKey)))
                        return "serverPublicKey: buffer expected";
                if (message.triesRemaining != null && message.hasOwnProperty("triesRemaining"))
                    if (!$util.isInteger(message.triesRemaining))
                        return "triesRemaining: integer expected";
                if (message.remainingBanDuration != null && message.hasOwnProperty("remainingBanDuration")) {
                    var error = $root.google.protobuf.Duration.verify(message.remainingBanDuration);
                    if (error)
                        return "remainingBanDuration." + error;
                }
                return null;
            };
    
            /**
             * Creates a KeyClaimResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.KeyClaimResponse} KeyClaimResponse
             */
            KeyClaimResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.KeyClaimResponse)
                    return object;
                var message = new $root.covidshield.KeyClaimResponse();
                switch (object.error) {
                case "NONE":
                case 0:
                    message.error = 0;
                    break;
                case "UNKNOWN":
                case 1:
                    message.error = 1;
                    break;
                case "INVALID_ONE_TIME_CODE":
                case 2:
                    message.error = 2;
                    break;
                case "SERVER_ERROR":
                case 3:
                    message.error = 3;
                    break;
                case "INVALID_KEY":
                case 4:
                    message.error = 4;
                    break;
                case "TEMPORARY_BAN":
                case 5:
                    message.error = 5;
                    break;
                }
                if (object.serverPublicKey != null)
                    if (typeof object.serverPublicKey === "string")
                        $util.base64.decode(object.serverPublicKey, message.serverPublicKey = $util.newBuffer($util.base64.length(object.serverPublicKey)), 0);
                    else if (object.serverPublicKey.length)
                        message.serverPublicKey = object.serverPublicKey;
                if (object.triesRemaining != null)
                    message.triesRemaining = object.triesRemaining >>> 0;
                if (object.remainingBanDuration != null) {
                    if (typeof object.remainingBanDuration !== "object")
                        throw TypeError(".covidshield.KeyClaimResponse.remainingBanDuration: object expected");
                    message.remainingBanDuration = $root.google.protobuf.Duration.fromObject(object.remainingBanDuration);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a KeyClaimResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.KeyClaimResponse
             * @static
             * @param {covidshield.KeyClaimResponse} message KeyClaimResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyClaimResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.error = options.enums === String ? "NONE" : 0;
                    if (options.bytes === String)
                        object.serverPublicKey = "";
                    else {
                        object.serverPublicKey = [];
                        if (options.bytes !== Array)
                            object.serverPublicKey = $util.newBuffer(object.serverPublicKey);
                    }
                    object.triesRemaining = 0;
                    object.remainingBanDuration = null;
                }
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = options.enums === String ? $root.covidshield.KeyClaimResponse.ErrorCode[message.error] : message.error;
                if (message.serverPublicKey != null && message.hasOwnProperty("serverPublicKey"))
                    object.serverPublicKey = options.bytes === String ? $util.base64.encode(message.serverPublicKey, 0, message.serverPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.serverPublicKey) : message.serverPublicKey;
                if (message.triesRemaining != null && message.hasOwnProperty("triesRemaining"))
                    object.triesRemaining = message.triesRemaining;
                if (message.remainingBanDuration != null && message.hasOwnProperty("remainingBanDuration"))
                    object.remainingBanDuration = $root.google.protobuf.Duration.toObject(message.remainingBanDuration, options);
                return object;
            };
    
            /**
             * Converts this KeyClaimResponse to JSON.
             * @function toJSON
             * @memberof covidshield.KeyClaimResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyClaimResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * ErrorCode enum.
             * @name covidshield.KeyClaimResponse.ErrorCode
             * @enum {number}
             * @property {number} NONE=0 NONE value
             * @property {number} UNKNOWN=1 UNKNOWN value
             * @property {number} INVALID_ONE_TIME_CODE=2 INVALID_ONE_TIME_CODE value
             * @property {number} SERVER_ERROR=3 SERVER_ERROR value
             * @property {number} INVALID_KEY=4 INVALID_KEY value
             * @property {number} TEMPORARY_BAN=5 TEMPORARY_BAN value
             */
            KeyClaimResponse.ErrorCode = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "NONE"] = 0;
                values[valuesById[1] = "UNKNOWN"] = 1;
                values[valuesById[2] = "INVALID_ONE_TIME_CODE"] = 2;
                values[valuesById[3] = "SERVER_ERROR"] = 3;
                values[valuesById[4] = "INVALID_KEY"] = 4;
                values[valuesById[5] = "TEMPORARY_BAN"] = 5;
                return values;
            })();
    
            return KeyClaimResponse;
        })();
    
        covidshield.EncryptedUploadRequest = (function() {
    
            /**
             * Properties of an EncryptedUploadRequest.
             * @memberof covidshield
             * @interface IEncryptedUploadRequest
             * @property {Uint8Array} serverPublicKey EncryptedUploadRequest serverPublicKey
             * @property {Uint8Array} appPublicKey EncryptedUploadRequest appPublicKey
             * @property {Uint8Array} nonce EncryptedUploadRequest nonce
             * @property {Uint8Array} payload EncryptedUploadRequest payload
             */
    
            /**
             * Constructs a new EncryptedUploadRequest.
             * @memberof covidshield
             * @classdesc Represents an EncryptedUploadRequest.
             * @implements IEncryptedUploadRequest
             * @constructor
             * @param {covidshield.IEncryptedUploadRequest=} [properties] Properties to set
             */
            function EncryptedUploadRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * EncryptedUploadRequest serverPublicKey.
             * @member {Uint8Array} serverPublicKey
             * @memberof covidshield.EncryptedUploadRequest
             * @instance
             */
            EncryptedUploadRequest.prototype.serverPublicKey = $util.newBuffer([]);
    
            /**
             * EncryptedUploadRequest appPublicKey.
             * @member {Uint8Array} appPublicKey
             * @memberof covidshield.EncryptedUploadRequest
             * @instance
             */
            EncryptedUploadRequest.prototype.appPublicKey = $util.newBuffer([]);
    
            /**
             * EncryptedUploadRequest nonce.
             * @member {Uint8Array} nonce
             * @memberof covidshield.EncryptedUploadRequest
             * @instance
             */
            EncryptedUploadRequest.prototype.nonce = $util.newBuffer([]);
    
            /**
             * EncryptedUploadRequest payload.
             * @member {Uint8Array} payload
             * @memberof covidshield.EncryptedUploadRequest
             * @instance
             */
            EncryptedUploadRequest.prototype.payload = $util.newBuffer([]);
    
            /**
             * Creates a new EncryptedUploadRequest instance using the specified properties.
             * @function create
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {covidshield.IEncryptedUploadRequest=} [properties] Properties to set
             * @returns {covidshield.EncryptedUploadRequest} EncryptedUploadRequest instance
             */
            EncryptedUploadRequest.create = function create(properties) {
                return new EncryptedUploadRequest(properties);
            };
    
            /**
             * Encodes the specified EncryptedUploadRequest message. Does not implicitly {@link covidshield.EncryptedUploadRequest.verify|verify} messages.
             * @function encode
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {covidshield.IEncryptedUploadRequest} message EncryptedUploadRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EncryptedUploadRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.serverPublicKey);
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.appPublicKey);
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.nonce);
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.payload);
                return writer;
            };
    
            /**
             * Encodes the specified EncryptedUploadRequest message, length delimited. Does not implicitly {@link covidshield.EncryptedUploadRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {covidshield.IEncryptedUploadRequest} message EncryptedUploadRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EncryptedUploadRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an EncryptedUploadRequest message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.EncryptedUploadRequest} EncryptedUploadRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EncryptedUploadRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.EncryptedUploadRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.serverPublicKey = reader.bytes();
                        break;
                    case 2:
                        message.appPublicKey = reader.bytes();
                        break;
                    case 3:
                        message.nonce = reader.bytes();
                        break;
                    case 4:
                        message.payload = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("serverPublicKey"))
                    throw $util.ProtocolError("missing required 'serverPublicKey'", { instance: message });
                if (!message.hasOwnProperty("appPublicKey"))
                    throw $util.ProtocolError("missing required 'appPublicKey'", { instance: message });
                if (!message.hasOwnProperty("nonce"))
                    throw $util.ProtocolError("missing required 'nonce'", { instance: message });
                if (!message.hasOwnProperty("payload"))
                    throw $util.ProtocolError("missing required 'payload'", { instance: message });
                return message;
            };
    
            /**
             * Decodes an EncryptedUploadRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.EncryptedUploadRequest} EncryptedUploadRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EncryptedUploadRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an EncryptedUploadRequest message.
             * @function verify
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EncryptedUploadRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!(message.serverPublicKey && typeof message.serverPublicKey.length === "number" || $util.isString(message.serverPublicKey)))
                    return "serverPublicKey: buffer expected";
                if (!(message.appPublicKey && typeof message.appPublicKey.length === "number" || $util.isString(message.appPublicKey)))
                    return "appPublicKey: buffer expected";
                if (!(message.nonce && typeof message.nonce.length === "number" || $util.isString(message.nonce)))
                    return "nonce: buffer expected";
                if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                    return "payload: buffer expected";
                return null;
            };
    
            /**
             * Creates an EncryptedUploadRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.EncryptedUploadRequest} EncryptedUploadRequest
             */
            EncryptedUploadRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.EncryptedUploadRequest)
                    return object;
                var message = new $root.covidshield.EncryptedUploadRequest();
                if (object.serverPublicKey != null)
                    if (typeof object.serverPublicKey === "string")
                        $util.base64.decode(object.serverPublicKey, message.serverPublicKey = $util.newBuffer($util.base64.length(object.serverPublicKey)), 0);
                    else if (object.serverPublicKey.length)
                        message.serverPublicKey = object.serverPublicKey;
                if (object.appPublicKey != null)
                    if (typeof object.appPublicKey === "string")
                        $util.base64.decode(object.appPublicKey, message.appPublicKey = $util.newBuffer($util.base64.length(object.appPublicKey)), 0);
                    else if (object.appPublicKey.length)
                        message.appPublicKey = object.appPublicKey;
                if (object.nonce != null)
                    if (typeof object.nonce === "string")
                        $util.base64.decode(object.nonce, message.nonce = $util.newBuffer($util.base64.length(object.nonce)), 0);
                    else if (object.nonce.length)
                        message.nonce = object.nonce;
                if (object.payload != null)
                    if (typeof object.payload === "string")
                        $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                    else if (object.payload.length)
                        message.payload = object.payload;
                return message;
            };
    
            /**
             * Creates a plain object from an EncryptedUploadRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.EncryptedUploadRequest
             * @static
             * @param {covidshield.EncryptedUploadRequest} message EncryptedUploadRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EncryptedUploadRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.serverPublicKey = "";
                    else {
                        object.serverPublicKey = [];
                        if (options.bytes !== Array)
                            object.serverPublicKey = $util.newBuffer(object.serverPublicKey);
                    }
                    if (options.bytes === String)
                        object.appPublicKey = "";
                    else {
                        object.appPublicKey = [];
                        if (options.bytes !== Array)
                            object.appPublicKey = $util.newBuffer(object.appPublicKey);
                    }
                    if (options.bytes === String)
                        object.nonce = "";
                    else {
                        object.nonce = [];
                        if (options.bytes !== Array)
                            object.nonce = $util.newBuffer(object.nonce);
                    }
                    if (options.bytes === String)
                        object.payload = "";
                    else {
                        object.payload = [];
                        if (options.bytes !== Array)
                            object.payload = $util.newBuffer(object.payload);
                    }
                }
                if (message.serverPublicKey != null && message.hasOwnProperty("serverPublicKey"))
                    object.serverPublicKey = options.bytes === String ? $util.base64.encode(message.serverPublicKey, 0, message.serverPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.serverPublicKey) : message.serverPublicKey;
                if (message.appPublicKey != null && message.hasOwnProperty("appPublicKey"))
                    object.appPublicKey = options.bytes === String ? $util.base64.encode(message.appPublicKey, 0, message.appPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.appPublicKey) : message.appPublicKey;
                if (message.nonce != null && message.hasOwnProperty("nonce"))
                    object.nonce = options.bytes === String ? $util.base64.encode(message.nonce, 0, message.nonce.length) : options.bytes === Array ? Array.prototype.slice.call(message.nonce) : message.nonce;
                if (message.payload != null && message.hasOwnProperty("payload"))
                    object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                return object;
            };
    
            /**
             * Converts this EncryptedUploadRequest to JSON.
             * @function toJSON
             * @memberof covidshield.EncryptedUploadRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EncryptedUploadRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return EncryptedUploadRequest;
        })();
    
        covidshield.EncryptedUploadResponse = (function() {
    
            /**
             * Properties of an EncryptedUploadResponse.
             * @memberof covidshield
             * @interface IEncryptedUploadResponse
             * @property {covidshield.EncryptedUploadResponse.ErrorCode} error EncryptedUploadResponse error
             */
    
            /**
             * Constructs a new EncryptedUploadResponse.
             * @memberof covidshield
             * @classdesc Represents an EncryptedUploadResponse.
             * @implements IEncryptedUploadResponse
             * @constructor
             * @param {covidshield.IEncryptedUploadResponse=} [properties] Properties to set
             */
            function EncryptedUploadResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * EncryptedUploadResponse error.
             * @member {covidshield.EncryptedUploadResponse.ErrorCode} error
             * @memberof covidshield.EncryptedUploadResponse
             * @instance
             */
            EncryptedUploadResponse.prototype.error = 0;
    
            /**
             * Creates a new EncryptedUploadResponse instance using the specified properties.
             * @function create
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {covidshield.IEncryptedUploadResponse=} [properties] Properties to set
             * @returns {covidshield.EncryptedUploadResponse} EncryptedUploadResponse instance
             */
            EncryptedUploadResponse.create = function create(properties) {
                return new EncryptedUploadResponse(properties);
            };
    
            /**
             * Encodes the specified EncryptedUploadResponse message. Does not implicitly {@link covidshield.EncryptedUploadResponse.verify|verify} messages.
             * @function encode
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {covidshield.IEncryptedUploadResponse} message EncryptedUploadResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EncryptedUploadResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.error);
                return writer;
            };
    
            /**
             * Encodes the specified EncryptedUploadResponse message, length delimited. Does not implicitly {@link covidshield.EncryptedUploadResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {covidshield.IEncryptedUploadResponse} message EncryptedUploadResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EncryptedUploadResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an EncryptedUploadResponse message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.EncryptedUploadResponse} EncryptedUploadResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EncryptedUploadResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.EncryptedUploadResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.error = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("error"))
                    throw $util.ProtocolError("missing required 'error'", { instance: message });
                return message;
            };
    
            /**
             * Decodes an EncryptedUploadResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.EncryptedUploadResponse} EncryptedUploadResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EncryptedUploadResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an EncryptedUploadResponse message.
             * @function verify
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EncryptedUploadResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                switch (message.error) {
                default:
                    return "error: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    break;
                }
                return null;
            };
    
            /**
             * Creates an EncryptedUploadResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.EncryptedUploadResponse} EncryptedUploadResponse
             */
            EncryptedUploadResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.EncryptedUploadResponse)
                    return object;
                var message = new $root.covidshield.EncryptedUploadResponse();
                switch (object.error) {
                case "NONE":
                case 0:
                    message.error = 0;
                    break;
                case "UNKNOWN":
                case 1:
                    message.error = 1;
                    break;
                case "INVALID_KEYPAIR":
                case 2:
                    message.error = 2;
                    break;
                case "DECRYPTION_FAILED":
                case 3:
                    message.error = 3;
                    break;
                case "INVALID_PAYLOAD":
                case 4:
                    message.error = 4;
                    break;
                case "SERVER_ERROR":
                case 5:
                    message.error = 5;
                    break;
                case "INVALID_CRYPTO_PARAMETERS":
                case 6:
                    message.error = 6;
                    break;
                case "TOO_MANY_KEYS":
                case 7:
                    message.error = 7;
                    break;
                case "INVALID_TIMESTAMP":
                case 8:
                    message.error = 8;
                    break;
                case "INVALID_ROLLING_PERIOD":
                case 10:
                    message.error = 10;
                    break;
                case "INVALID_KEY_DATA":
                case 11:
                    message.error = 11;
                    break;
                case "INVALID_ROLLING_START_INTERVAL_NUMBER":
                case 12:
                    message.error = 12;
                    break;
                case "INVALID_TRANSMISSION_RISK_LEVEL":
                case 13:
                    message.error = 13;
                    break;
                case "NO_KEYS_IN_PAYLOAD":
                case 14:
                    message.error = 14;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from an EncryptedUploadResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.EncryptedUploadResponse
             * @static
             * @param {covidshield.EncryptedUploadResponse} message EncryptedUploadResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EncryptedUploadResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.error = options.enums === String ? "NONE" : 0;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = options.enums === String ? $root.covidshield.EncryptedUploadResponse.ErrorCode[message.error] : message.error;
                return object;
            };
    
            /**
             * Converts this EncryptedUploadResponse to JSON.
             * @function toJSON
             * @memberof covidshield.EncryptedUploadResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EncryptedUploadResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * ErrorCode enum.
             * @name covidshield.EncryptedUploadResponse.ErrorCode
             * @enum {number}
             * @property {number} NONE=0 NONE value
             * @property {number} UNKNOWN=1 UNKNOWN value
             * @property {number} INVALID_KEYPAIR=2 INVALID_KEYPAIR value
             * @property {number} DECRYPTION_FAILED=3 DECRYPTION_FAILED value
             * @property {number} INVALID_PAYLOAD=4 INVALID_PAYLOAD value
             * @property {number} SERVER_ERROR=5 SERVER_ERROR value
             * @property {number} INVALID_CRYPTO_PARAMETERS=6 INVALID_CRYPTO_PARAMETERS value
             * @property {number} TOO_MANY_KEYS=7 TOO_MANY_KEYS value
             * @property {number} INVALID_TIMESTAMP=8 INVALID_TIMESTAMP value
             * @property {number} INVALID_ROLLING_PERIOD=10 INVALID_ROLLING_PERIOD value
             * @property {number} INVALID_KEY_DATA=11 INVALID_KEY_DATA value
             * @property {number} INVALID_ROLLING_START_INTERVAL_NUMBER=12 INVALID_ROLLING_START_INTERVAL_NUMBER value
             * @property {number} INVALID_TRANSMISSION_RISK_LEVEL=13 INVALID_TRANSMISSION_RISK_LEVEL value
             * @property {number} NO_KEYS_IN_PAYLOAD=14 NO_KEYS_IN_PAYLOAD value
             */
            EncryptedUploadResponse.ErrorCode = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "NONE"] = 0;
                values[valuesById[1] = "UNKNOWN"] = 1;
                values[valuesById[2] = "INVALID_KEYPAIR"] = 2;
                values[valuesById[3] = "DECRYPTION_FAILED"] = 3;
                values[valuesById[4] = "INVALID_PAYLOAD"] = 4;
                values[valuesById[5] = "SERVER_ERROR"] = 5;
                values[valuesById[6] = "INVALID_CRYPTO_PARAMETERS"] = 6;
                values[valuesById[7] = "TOO_MANY_KEYS"] = 7;
                values[valuesById[8] = "INVALID_TIMESTAMP"] = 8;
                values[valuesById[10] = "INVALID_ROLLING_PERIOD"] = 10;
                values[valuesById[11] = "INVALID_KEY_DATA"] = 11;
                values[valuesById[12] = "INVALID_ROLLING_START_INTERVAL_NUMBER"] = 12;
                values[valuesById[13] = "INVALID_TRANSMISSION_RISK_LEVEL"] = 13;
                values[valuesById[14] = "NO_KEYS_IN_PAYLOAD"] = 14;
                return values;
            })();
    
            return EncryptedUploadResponse;
        })();
    
        covidshield.Upload = (function() {
    
            /**
             * Properties of an Upload.
             * @memberof covidshield
             * @interface IUpload
             * @property {google.protobuf.ITimestamp} timestamp Upload timestamp
             * @property {Array.<covidshield.ITemporaryExposureKey>|null} [keys] Upload keys
             */
    
            /**
             * Constructs a new Upload.
             * @memberof covidshield
             * @classdesc Represents an Upload.
             * @implements IUpload
             * @constructor
             * @param {covidshield.IUpload=} [properties] Properties to set
             */
            function Upload(properties) {
                this.keys = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Upload timestamp.
             * @member {google.protobuf.ITimestamp} timestamp
             * @memberof covidshield.Upload
             * @instance
             */
            Upload.prototype.timestamp = null;
    
            /**
             * Upload keys.
             * @member {Array.<covidshield.ITemporaryExposureKey>} keys
             * @memberof covidshield.Upload
             * @instance
             */
            Upload.prototype.keys = $util.emptyArray;
    
            /**
             * Creates a new Upload instance using the specified properties.
             * @function create
             * @memberof covidshield.Upload
             * @static
             * @param {covidshield.IUpload=} [properties] Properties to set
             * @returns {covidshield.Upload} Upload instance
             */
            Upload.create = function create(properties) {
                return new Upload(properties);
            };
    
            /**
             * Encodes the specified Upload message. Does not implicitly {@link covidshield.Upload.verify|verify} messages.
             * @function encode
             * @memberof covidshield.Upload
             * @static
             * @param {covidshield.IUpload} message Upload message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Upload.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                $root.google.protobuf.Timestamp.encode(message.timestamp, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.keys != null && message.keys.length)
                    for (var i = 0; i < message.keys.length; ++i)
                        $root.covidshield.TemporaryExposureKey.encode(message.keys[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified Upload message, length delimited. Does not implicitly {@link covidshield.Upload.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.Upload
             * @static
             * @param {covidshield.IUpload} message Upload message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Upload.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an Upload message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.Upload
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.Upload} Upload
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Upload.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.Upload();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.timestamp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    case 2:
                        if (!(message.keys && message.keys.length))
                            message.keys = [];
                        message.keys.push($root.covidshield.TemporaryExposureKey.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("timestamp"))
                    throw $util.ProtocolError("missing required 'timestamp'", { instance: message });
                return message;
            };
    
            /**
             * Decodes an Upload message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.Upload
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.Upload} Upload
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Upload.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an Upload message.
             * @function verify
             * @memberof covidshield.Upload
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Upload.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                {
                    var error = $root.google.protobuf.Timestamp.verify(message.timestamp);
                    if (error)
                        return "timestamp." + error;
                }
                if (message.keys != null && message.hasOwnProperty("keys")) {
                    if (!Array.isArray(message.keys))
                        return "keys: array expected";
                    for (var i = 0; i < message.keys.length; ++i) {
                        var error = $root.covidshield.TemporaryExposureKey.verify(message.keys[i]);
                        if (error)
                            return "keys." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates an Upload message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.Upload
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.Upload} Upload
             */
            Upload.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.Upload)
                    return object;
                var message = new $root.covidshield.Upload();
                if (object.timestamp != null) {
                    if (typeof object.timestamp !== "object")
                        throw TypeError(".covidshield.Upload.timestamp: object expected");
                    message.timestamp = $root.google.protobuf.Timestamp.fromObject(object.timestamp);
                }
                if (object.keys) {
                    if (!Array.isArray(object.keys))
                        throw TypeError(".covidshield.Upload.keys: array expected");
                    message.keys = [];
                    for (var i = 0; i < object.keys.length; ++i) {
                        if (typeof object.keys[i] !== "object")
                            throw TypeError(".covidshield.Upload.keys: object expected");
                        message.keys[i] = $root.covidshield.TemporaryExposureKey.fromObject(object.keys[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from an Upload message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.Upload
             * @static
             * @param {covidshield.Upload} message Upload
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Upload.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.keys = [];
                if (options.defaults)
                    object.timestamp = null;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = $root.google.protobuf.Timestamp.toObject(message.timestamp, options);
                if (message.keys && message.keys.length) {
                    object.keys = [];
                    for (var j = 0; j < message.keys.length; ++j)
                        object.keys[j] = $root.covidshield.TemporaryExposureKey.toObject(message.keys[j], options);
                }
                return object;
            };
    
            /**
             * Converts this Upload to JSON.
             * @function toJSON
             * @memberof covidshield.Upload
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Upload.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Upload;
        })();
    
        covidshield.TemporaryExposureKeyExport = (function() {
    
            /**
             * Properties of a TemporaryExposureKeyExport.
             * @memberof covidshield
             * @interface ITemporaryExposureKeyExport
             * @property {number|Long|null} [startTimestamp] TemporaryExposureKeyExport startTimestamp
             * @property {number|Long|null} [endTimestamp] TemporaryExposureKeyExport endTimestamp
             * @property {string|null} [region] TemporaryExposureKeyExport region
             * @property {number|null} [batchNum] TemporaryExposureKeyExport batchNum
             * @property {number|null} [batchSize] TemporaryExposureKeyExport batchSize
             * @property {Array.<covidshield.ISignatureInfo>|null} [signatureInfos] TemporaryExposureKeyExport signatureInfos
             * @property {Array.<covidshield.ITemporaryExposureKey>|null} [keys] TemporaryExposureKeyExport keys
             */
    
            /**
             * Constructs a new TemporaryExposureKeyExport.
             * @memberof covidshield
             * @classdesc Represents a TemporaryExposureKeyExport.
             * @implements ITemporaryExposureKeyExport
             * @constructor
             * @param {covidshield.ITemporaryExposureKeyExport=} [properties] Properties to set
             */
            function TemporaryExposureKeyExport(properties) {
                this.signatureInfos = [];
                this.keys = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TemporaryExposureKeyExport startTimestamp.
             * @member {number|Long} startTimestamp
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * TemporaryExposureKeyExport endTimestamp.
             * @member {number|Long} endTimestamp
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.endTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * TemporaryExposureKeyExport region.
             * @member {string} region
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.region = "";
    
            /**
             * TemporaryExposureKeyExport batchNum.
             * @member {number} batchNum
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.batchNum = 0;
    
            /**
             * TemporaryExposureKeyExport batchSize.
             * @member {number} batchSize
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.batchSize = 0;
    
            /**
             * TemporaryExposureKeyExport signatureInfos.
             * @member {Array.<covidshield.ISignatureInfo>} signatureInfos
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.signatureInfos = $util.emptyArray;
    
            /**
             * TemporaryExposureKeyExport keys.
             * @member {Array.<covidshield.ITemporaryExposureKey>} keys
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             */
            TemporaryExposureKeyExport.prototype.keys = $util.emptyArray;
    
            /**
             * Creates a new TemporaryExposureKeyExport instance using the specified properties.
             * @function create
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {covidshield.ITemporaryExposureKeyExport=} [properties] Properties to set
             * @returns {covidshield.TemporaryExposureKeyExport} TemporaryExposureKeyExport instance
             */
            TemporaryExposureKeyExport.create = function create(properties) {
                return new TemporaryExposureKeyExport(properties);
            };
    
            /**
             * Encodes the specified TemporaryExposureKeyExport message. Does not implicitly {@link covidshield.TemporaryExposureKeyExport.verify|verify} messages.
             * @function encode
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {covidshield.ITemporaryExposureKeyExport} message TemporaryExposureKeyExport message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TemporaryExposureKeyExport.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.startTimestamp);
                if (message.endTimestamp != null && Object.hasOwnProperty.call(message, "endTimestamp"))
                    writer.uint32(/* id 2, wireType 1 =*/17).fixed64(message.endTimestamp);
                if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.region);
                if (message.batchNum != null && Object.hasOwnProperty.call(message, "batchNum"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.batchNum);
                if (message.batchSize != null && Object.hasOwnProperty.call(message, "batchSize"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.batchSize);
                if (message.signatureInfos != null && message.signatureInfos.length)
                    for (var i = 0; i < message.signatureInfos.length; ++i)
                        $root.covidshield.SignatureInfo.encode(message.signatureInfos[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.keys != null && message.keys.length)
                    for (var i = 0; i < message.keys.length; ++i)
                        $root.covidshield.TemporaryExposureKey.encode(message.keys[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified TemporaryExposureKeyExport message, length delimited. Does not implicitly {@link covidshield.TemporaryExposureKeyExport.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {covidshield.ITemporaryExposureKeyExport} message TemporaryExposureKeyExport message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TemporaryExposureKeyExport.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TemporaryExposureKeyExport message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.TemporaryExposureKeyExport} TemporaryExposureKeyExport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TemporaryExposureKeyExport.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.TemporaryExposureKeyExport();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.startTimestamp = reader.fixed64();
                        break;
                    case 2:
                        message.endTimestamp = reader.fixed64();
                        break;
                    case 3:
                        message.region = reader.string();
                        break;
                    case 4:
                        message.batchNum = reader.int32();
                        break;
                    case 5:
                        message.batchSize = reader.int32();
                        break;
                    case 6:
                        if (!(message.signatureInfos && message.signatureInfos.length))
                            message.signatureInfos = [];
                        message.signatureInfos.push($root.covidshield.SignatureInfo.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        if (!(message.keys && message.keys.length))
                            message.keys = [];
                        message.keys.push($root.covidshield.TemporaryExposureKey.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TemporaryExposureKeyExport message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.TemporaryExposureKeyExport} TemporaryExposureKeyExport
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TemporaryExposureKeyExport.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TemporaryExposureKeyExport message.
             * @function verify
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TemporaryExposureKeyExport.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                    if (!$util.isInteger(message.startTimestamp) && !(message.startTimestamp && $util.isInteger(message.startTimestamp.low) && $util.isInteger(message.startTimestamp.high)))
                        return "startTimestamp: integer|Long expected";
                if (message.endTimestamp != null && message.hasOwnProperty("endTimestamp"))
                    if (!$util.isInteger(message.endTimestamp) && !(message.endTimestamp && $util.isInteger(message.endTimestamp.low) && $util.isInteger(message.endTimestamp.high)))
                        return "endTimestamp: integer|Long expected";
                if (message.region != null && message.hasOwnProperty("region"))
                    if (!$util.isString(message.region))
                        return "region: string expected";
                if (message.batchNum != null && message.hasOwnProperty("batchNum"))
                    if (!$util.isInteger(message.batchNum))
                        return "batchNum: integer expected";
                if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                    if (!$util.isInteger(message.batchSize))
                        return "batchSize: integer expected";
                if (message.signatureInfos != null && message.hasOwnProperty("signatureInfos")) {
                    if (!Array.isArray(message.signatureInfos))
                        return "signatureInfos: array expected";
                    for (var i = 0; i < message.signatureInfos.length; ++i) {
                        var error = $root.covidshield.SignatureInfo.verify(message.signatureInfos[i]);
                        if (error)
                            return "signatureInfos." + error;
                    }
                }
                if (message.keys != null && message.hasOwnProperty("keys")) {
                    if (!Array.isArray(message.keys))
                        return "keys: array expected";
                    for (var i = 0; i < message.keys.length; ++i) {
                        var error = $root.covidshield.TemporaryExposureKey.verify(message.keys[i]);
                        if (error)
                            return "keys." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a TemporaryExposureKeyExport message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.TemporaryExposureKeyExport} TemporaryExposureKeyExport
             */
            TemporaryExposureKeyExport.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.TemporaryExposureKeyExport)
                    return object;
                var message = new $root.covidshield.TemporaryExposureKeyExport();
                if (object.startTimestamp != null)
                    if ($util.Long)
                        (message.startTimestamp = $util.Long.fromValue(object.startTimestamp)).unsigned = false;
                    else if (typeof object.startTimestamp === "string")
                        message.startTimestamp = parseInt(object.startTimestamp, 10);
                    else if (typeof object.startTimestamp === "number")
                        message.startTimestamp = object.startTimestamp;
                    else if (typeof object.startTimestamp === "object")
                        message.startTimestamp = new $util.LongBits(object.startTimestamp.low >>> 0, object.startTimestamp.high >>> 0).toNumber();
                if (object.endTimestamp != null)
                    if ($util.Long)
                        (message.endTimestamp = $util.Long.fromValue(object.endTimestamp)).unsigned = false;
                    else if (typeof object.endTimestamp === "string")
                        message.endTimestamp = parseInt(object.endTimestamp, 10);
                    else if (typeof object.endTimestamp === "number")
                        message.endTimestamp = object.endTimestamp;
                    else if (typeof object.endTimestamp === "object")
                        message.endTimestamp = new $util.LongBits(object.endTimestamp.low >>> 0, object.endTimestamp.high >>> 0).toNumber();
                if (object.region != null)
                    message.region = String(object.region);
                if (object.batchNum != null)
                    message.batchNum = object.batchNum | 0;
                if (object.batchSize != null)
                    message.batchSize = object.batchSize | 0;
                if (object.signatureInfos) {
                    if (!Array.isArray(object.signatureInfos))
                        throw TypeError(".covidshield.TemporaryExposureKeyExport.signatureInfos: array expected");
                    message.signatureInfos = [];
                    for (var i = 0; i < object.signatureInfos.length; ++i) {
                        if (typeof object.signatureInfos[i] !== "object")
                            throw TypeError(".covidshield.TemporaryExposureKeyExport.signatureInfos: object expected");
                        message.signatureInfos[i] = $root.covidshield.SignatureInfo.fromObject(object.signatureInfos[i]);
                    }
                }
                if (object.keys) {
                    if (!Array.isArray(object.keys))
                        throw TypeError(".covidshield.TemporaryExposureKeyExport.keys: array expected");
                    message.keys = [];
                    for (var i = 0; i < object.keys.length; ++i) {
                        if (typeof object.keys[i] !== "object")
                            throw TypeError(".covidshield.TemporaryExposureKeyExport.keys: object expected");
                        message.keys[i] = $root.covidshield.TemporaryExposureKey.fromObject(object.keys[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a TemporaryExposureKeyExport message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.TemporaryExposureKeyExport
             * @static
             * @param {covidshield.TemporaryExposureKeyExport} message TemporaryExposureKeyExport
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TemporaryExposureKeyExport.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.signatureInfos = [];
                    object.keys = [];
                }
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.startTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.startTimestamp = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.endTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.endTimestamp = options.longs === String ? "0" : 0;
                    object.region = "";
                    object.batchNum = 0;
                    object.batchSize = 0;
                }
                if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                    if (typeof message.startTimestamp === "number")
                        object.startTimestamp = options.longs === String ? String(message.startTimestamp) : message.startTimestamp;
                    else
                        object.startTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.startTimestamp) : options.longs === Number ? new $util.LongBits(message.startTimestamp.low >>> 0, message.startTimestamp.high >>> 0).toNumber() : message.startTimestamp;
                if (message.endTimestamp != null && message.hasOwnProperty("endTimestamp"))
                    if (typeof message.endTimestamp === "number")
                        object.endTimestamp = options.longs === String ? String(message.endTimestamp) : message.endTimestamp;
                    else
                        object.endTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.endTimestamp) : options.longs === Number ? new $util.LongBits(message.endTimestamp.low >>> 0, message.endTimestamp.high >>> 0).toNumber() : message.endTimestamp;
                if (message.region != null && message.hasOwnProperty("region"))
                    object.region = message.region;
                if (message.batchNum != null && message.hasOwnProperty("batchNum"))
                    object.batchNum = message.batchNum;
                if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                    object.batchSize = message.batchSize;
                if (message.signatureInfos && message.signatureInfos.length) {
                    object.signatureInfos = [];
                    for (var j = 0; j < message.signatureInfos.length; ++j)
                        object.signatureInfos[j] = $root.covidshield.SignatureInfo.toObject(message.signatureInfos[j], options);
                }
                if (message.keys && message.keys.length) {
                    object.keys = [];
                    for (var j = 0; j < message.keys.length; ++j)
                        object.keys[j] = $root.covidshield.TemporaryExposureKey.toObject(message.keys[j], options);
                }
                return object;
            };
    
            /**
             * Converts this TemporaryExposureKeyExport to JSON.
             * @function toJSON
             * @memberof covidshield.TemporaryExposureKeyExport
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TemporaryExposureKeyExport.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TemporaryExposureKeyExport;
        })();
    
        covidshield.SignatureInfo = (function() {
    
            /**
             * Properties of a SignatureInfo.
             * @memberof covidshield
             * @interface ISignatureInfo
             * @property {string|null} [verificationKeyVersion] SignatureInfo verificationKeyVersion
             * @property {string|null} [verificationKeyId] SignatureInfo verificationKeyId
             * @property {string|null} [signatureAlgorithm] SignatureInfo signatureAlgorithm
             */
    
            /**
             * Constructs a new SignatureInfo.
             * @memberof covidshield
             * @classdesc Represents a SignatureInfo.
             * @implements ISignatureInfo
             * @constructor
             * @param {covidshield.ISignatureInfo=} [properties] Properties to set
             */
            function SignatureInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SignatureInfo verificationKeyVersion.
             * @member {string} verificationKeyVersion
             * @memberof covidshield.SignatureInfo
             * @instance
             */
            SignatureInfo.prototype.verificationKeyVersion = "";
    
            /**
             * SignatureInfo verificationKeyId.
             * @member {string} verificationKeyId
             * @memberof covidshield.SignatureInfo
             * @instance
             */
            SignatureInfo.prototype.verificationKeyId = "";
    
            /**
             * SignatureInfo signatureAlgorithm.
             * @member {string} signatureAlgorithm
             * @memberof covidshield.SignatureInfo
             * @instance
             */
            SignatureInfo.prototype.signatureAlgorithm = "";
    
            /**
             * Creates a new SignatureInfo instance using the specified properties.
             * @function create
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {covidshield.ISignatureInfo=} [properties] Properties to set
             * @returns {covidshield.SignatureInfo} SignatureInfo instance
             */
            SignatureInfo.create = function create(properties) {
                return new SignatureInfo(properties);
            };
    
            /**
             * Encodes the specified SignatureInfo message. Does not implicitly {@link covidshield.SignatureInfo.verify|verify} messages.
             * @function encode
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {covidshield.ISignatureInfo} message SignatureInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignatureInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.verificationKeyVersion != null && Object.hasOwnProperty.call(message, "verificationKeyVersion"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.verificationKeyVersion);
                if (message.verificationKeyId != null && Object.hasOwnProperty.call(message, "verificationKeyId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.verificationKeyId);
                if (message.signatureAlgorithm != null && Object.hasOwnProperty.call(message, "signatureAlgorithm"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.signatureAlgorithm);
                return writer;
            };
    
            /**
             * Encodes the specified SignatureInfo message, length delimited. Does not implicitly {@link covidshield.SignatureInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {covidshield.ISignatureInfo} message SignatureInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignatureInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SignatureInfo message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.SignatureInfo} SignatureInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignatureInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.SignatureInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 3:
                        message.verificationKeyVersion = reader.string();
                        break;
                    case 4:
                        message.verificationKeyId = reader.string();
                        break;
                    case 5:
                        message.signatureAlgorithm = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SignatureInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.SignatureInfo} SignatureInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignatureInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SignatureInfo message.
             * @function verify
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignatureInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.verificationKeyVersion != null && message.hasOwnProperty("verificationKeyVersion"))
                    if (!$util.isString(message.verificationKeyVersion))
                        return "verificationKeyVersion: string expected";
                if (message.verificationKeyId != null && message.hasOwnProperty("verificationKeyId"))
                    if (!$util.isString(message.verificationKeyId))
                        return "verificationKeyId: string expected";
                if (message.signatureAlgorithm != null && message.hasOwnProperty("signatureAlgorithm"))
                    if (!$util.isString(message.signatureAlgorithm))
                        return "signatureAlgorithm: string expected";
                return null;
            };
    
            /**
             * Creates a SignatureInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.SignatureInfo} SignatureInfo
             */
            SignatureInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.SignatureInfo)
                    return object;
                var message = new $root.covidshield.SignatureInfo();
                if (object.verificationKeyVersion != null)
                    message.verificationKeyVersion = String(object.verificationKeyVersion);
                if (object.verificationKeyId != null)
                    message.verificationKeyId = String(object.verificationKeyId);
                if (object.signatureAlgorithm != null)
                    message.signatureAlgorithm = String(object.signatureAlgorithm);
                return message;
            };
    
            /**
             * Creates a plain object from a SignatureInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.SignatureInfo
             * @static
             * @param {covidshield.SignatureInfo} message SignatureInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignatureInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.verificationKeyVersion = "";
                    object.verificationKeyId = "";
                    object.signatureAlgorithm = "";
                }
                if (message.verificationKeyVersion != null && message.hasOwnProperty("verificationKeyVersion"))
                    object.verificationKeyVersion = message.verificationKeyVersion;
                if (message.verificationKeyId != null && message.hasOwnProperty("verificationKeyId"))
                    object.verificationKeyId = message.verificationKeyId;
                if (message.signatureAlgorithm != null && message.hasOwnProperty("signatureAlgorithm"))
                    object.signatureAlgorithm = message.signatureAlgorithm;
                return object;
            };
    
            /**
             * Converts this SignatureInfo to JSON.
             * @function toJSON
             * @memberof covidshield.SignatureInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignatureInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SignatureInfo;
        })();
    
        covidshield.TemporaryExposureKey = (function() {
    
            /**
             * Properties of a TemporaryExposureKey.
             * @memberof covidshield
             * @interface ITemporaryExposureKey
             * @property {Uint8Array|null} [keyData] TemporaryExposureKey keyData
             * @property {number|null} [transmissionRiskLevel] TemporaryExposureKey transmissionRiskLevel
             * @property {number|null} [rollingStartIntervalNumber] TemporaryExposureKey rollingStartIntervalNumber
             * @property {number|null} [rollingPeriod] TemporaryExposureKey rollingPeriod
             */
    
            /**
             * Constructs a new TemporaryExposureKey.
             * @memberof covidshield
             * @classdesc Represents a TemporaryExposureKey.
             * @implements ITemporaryExposureKey
             * @constructor
             * @param {covidshield.ITemporaryExposureKey=} [properties] Properties to set
             */
            function TemporaryExposureKey(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TemporaryExposureKey keyData.
             * @member {Uint8Array} keyData
             * @memberof covidshield.TemporaryExposureKey
             * @instance
             */
            TemporaryExposureKey.prototype.keyData = $util.newBuffer([]);
    
            /**
             * TemporaryExposureKey transmissionRiskLevel.
             * @member {number} transmissionRiskLevel
             * @memberof covidshield.TemporaryExposureKey
             * @instance
             */
            TemporaryExposureKey.prototype.transmissionRiskLevel = 0;
    
            /**
             * TemporaryExposureKey rollingStartIntervalNumber.
             * @member {number} rollingStartIntervalNumber
             * @memberof covidshield.TemporaryExposureKey
             * @instance
             */
            TemporaryExposureKey.prototype.rollingStartIntervalNumber = 0;
    
            /**
             * TemporaryExposureKey rollingPeriod.
             * @member {number} rollingPeriod
             * @memberof covidshield.TemporaryExposureKey
             * @instance
             */
            TemporaryExposureKey.prototype.rollingPeriod = 144;
    
            /**
             * Creates a new TemporaryExposureKey instance using the specified properties.
             * @function create
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {covidshield.ITemporaryExposureKey=} [properties] Properties to set
             * @returns {covidshield.TemporaryExposureKey} TemporaryExposureKey instance
             */
            TemporaryExposureKey.create = function create(properties) {
                return new TemporaryExposureKey(properties);
            };
    
            /**
             * Encodes the specified TemporaryExposureKey message. Does not implicitly {@link covidshield.TemporaryExposureKey.verify|verify} messages.
             * @function encode
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {covidshield.ITemporaryExposureKey} message TemporaryExposureKey message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TemporaryExposureKey.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.keyData != null && Object.hasOwnProperty.call(message, "keyData"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.keyData);
                if (message.transmissionRiskLevel != null && Object.hasOwnProperty.call(message, "transmissionRiskLevel"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.transmissionRiskLevel);
                if (message.rollingStartIntervalNumber != null && Object.hasOwnProperty.call(message, "rollingStartIntervalNumber"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.rollingStartIntervalNumber);
                if (message.rollingPeriod != null && Object.hasOwnProperty.call(message, "rollingPeriod"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.rollingPeriod);
                return writer;
            };
    
            /**
             * Encodes the specified TemporaryExposureKey message, length delimited. Does not implicitly {@link covidshield.TemporaryExposureKey.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {covidshield.ITemporaryExposureKey} message TemporaryExposureKey message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TemporaryExposureKey.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TemporaryExposureKey message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.TemporaryExposureKey} TemporaryExposureKey
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TemporaryExposureKey.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.TemporaryExposureKey();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.keyData = reader.bytes();
                        break;
                    case 2:
                        message.transmissionRiskLevel = reader.int32();
                        break;
                    case 3:
                        message.rollingStartIntervalNumber = reader.int32();
                        break;
                    case 4:
                        message.rollingPeriod = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TemporaryExposureKey message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.TemporaryExposureKey} TemporaryExposureKey
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TemporaryExposureKey.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TemporaryExposureKey message.
             * @function verify
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TemporaryExposureKey.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.keyData != null && message.hasOwnProperty("keyData"))
                    if (!(message.keyData && typeof message.keyData.length === "number" || $util.isString(message.keyData)))
                        return "keyData: buffer expected";
                if (message.transmissionRiskLevel != null && message.hasOwnProperty("transmissionRiskLevel"))
                    if (!$util.isInteger(message.transmissionRiskLevel))
                        return "transmissionRiskLevel: integer expected";
                if (message.rollingStartIntervalNumber != null && message.hasOwnProperty("rollingStartIntervalNumber"))
                    if (!$util.isInteger(message.rollingStartIntervalNumber))
                        return "rollingStartIntervalNumber: integer expected";
                if (message.rollingPeriod != null && message.hasOwnProperty("rollingPeriod"))
                    if (!$util.isInteger(message.rollingPeriod))
                        return "rollingPeriod: integer expected";
                return null;
            };
    
            /**
             * Creates a TemporaryExposureKey message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.TemporaryExposureKey} TemporaryExposureKey
             */
            TemporaryExposureKey.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.TemporaryExposureKey)
                    return object;
                var message = new $root.covidshield.TemporaryExposureKey();
                if (object.keyData != null)
                    if (typeof object.keyData === "string")
                        $util.base64.decode(object.keyData, message.keyData = $util.newBuffer($util.base64.length(object.keyData)), 0);
                    else if (object.keyData.length)
                        message.keyData = object.keyData;
                if (object.transmissionRiskLevel != null)
                    message.transmissionRiskLevel = object.transmissionRiskLevel | 0;
                if (object.rollingStartIntervalNumber != null)
                    message.rollingStartIntervalNumber = object.rollingStartIntervalNumber | 0;
                if (object.rollingPeriod != null)
                    message.rollingPeriod = object.rollingPeriod | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a TemporaryExposureKey message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.TemporaryExposureKey
             * @static
             * @param {covidshield.TemporaryExposureKey} message TemporaryExposureKey
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TemporaryExposureKey.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.keyData = "";
                    else {
                        object.keyData = [];
                        if (options.bytes !== Array)
                            object.keyData = $util.newBuffer(object.keyData);
                    }
                    object.transmissionRiskLevel = 0;
                    object.rollingStartIntervalNumber = 0;
                    object.rollingPeriod = 144;
                }
                if (message.keyData != null && message.hasOwnProperty("keyData"))
                    object.keyData = options.bytes === String ? $util.base64.encode(message.keyData, 0, message.keyData.length) : options.bytes === Array ? Array.prototype.slice.call(message.keyData) : message.keyData;
                if (message.transmissionRiskLevel != null && message.hasOwnProperty("transmissionRiskLevel"))
                    object.transmissionRiskLevel = message.transmissionRiskLevel;
                if (message.rollingStartIntervalNumber != null && message.hasOwnProperty("rollingStartIntervalNumber"))
                    object.rollingStartIntervalNumber = message.rollingStartIntervalNumber;
                if (message.rollingPeriod != null && message.hasOwnProperty("rollingPeriod"))
                    object.rollingPeriod = message.rollingPeriod;
                return object;
            };
    
            /**
             * Converts this TemporaryExposureKey to JSON.
             * @function toJSON
             * @memberof covidshield.TemporaryExposureKey
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TemporaryExposureKey.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TemporaryExposureKey;
        })();
    
        covidshield.TEKSignatureList = (function() {
    
            /**
             * Properties of a TEKSignatureList.
             * @memberof covidshield
             * @interface ITEKSignatureList
             * @property {Array.<covidshield.ITEKSignature>|null} [signatures] TEKSignatureList signatures
             */
    
            /**
             * Constructs a new TEKSignatureList.
             * @memberof covidshield
             * @classdesc Represents a TEKSignatureList.
             * @implements ITEKSignatureList
             * @constructor
             * @param {covidshield.ITEKSignatureList=} [properties] Properties to set
             */
            function TEKSignatureList(properties) {
                this.signatures = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TEKSignatureList signatures.
             * @member {Array.<covidshield.ITEKSignature>} signatures
             * @memberof covidshield.TEKSignatureList
             * @instance
             */
            TEKSignatureList.prototype.signatures = $util.emptyArray;
    
            /**
             * Creates a new TEKSignatureList instance using the specified properties.
             * @function create
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {covidshield.ITEKSignatureList=} [properties] Properties to set
             * @returns {covidshield.TEKSignatureList} TEKSignatureList instance
             */
            TEKSignatureList.create = function create(properties) {
                return new TEKSignatureList(properties);
            };
    
            /**
             * Encodes the specified TEKSignatureList message. Does not implicitly {@link covidshield.TEKSignatureList.verify|verify} messages.
             * @function encode
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {covidshield.ITEKSignatureList} message TEKSignatureList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TEKSignatureList.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.signatures != null && message.signatures.length)
                    for (var i = 0; i < message.signatures.length; ++i)
                        $root.covidshield.TEKSignature.encode(message.signatures[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified TEKSignatureList message, length delimited. Does not implicitly {@link covidshield.TEKSignatureList.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {covidshield.ITEKSignatureList} message TEKSignatureList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TEKSignatureList.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TEKSignatureList message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.TEKSignatureList} TEKSignatureList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TEKSignatureList.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.TEKSignatureList();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.signatures && message.signatures.length))
                            message.signatures = [];
                        message.signatures.push($root.covidshield.TEKSignature.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TEKSignatureList message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.TEKSignatureList} TEKSignatureList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TEKSignatureList.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TEKSignatureList message.
             * @function verify
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TEKSignatureList.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.signatures != null && message.hasOwnProperty("signatures")) {
                    if (!Array.isArray(message.signatures))
                        return "signatures: array expected";
                    for (var i = 0; i < message.signatures.length; ++i) {
                        var error = $root.covidshield.TEKSignature.verify(message.signatures[i]);
                        if (error)
                            return "signatures." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a TEKSignatureList message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.TEKSignatureList} TEKSignatureList
             */
            TEKSignatureList.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.TEKSignatureList)
                    return object;
                var message = new $root.covidshield.TEKSignatureList();
                if (object.signatures) {
                    if (!Array.isArray(object.signatures))
                        throw TypeError(".covidshield.TEKSignatureList.signatures: array expected");
                    message.signatures = [];
                    for (var i = 0; i < object.signatures.length; ++i) {
                        if (typeof object.signatures[i] !== "object")
                            throw TypeError(".covidshield.TEKSignatureList.signatures: object expected");
                        message.signatures[i] = $root.covidshield.TEKSignature.fromObject(object.signatures[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a TEKSignatureList message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.TEKSignatureList
             * @static
             * @param {covidshield.TEKSignatureList} message TEKSignatureList
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TEKSignatureList.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.signatures = [];
                if (message.signatures && message.signatures.length) {
                    object.signatures = [];
                    for (var j = 0; j < message.signatures.length; ++j)
                        object.signatures[j] = $root.covidshield.TEKSignature.toObject(message.signatures[j], options);
                }
                return object;
            };
    
            /**
             * Converts this TEKSignatureList to JSON.
             * @function toJSON
             * @memberof covidshield.TEKSignatureList
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TEKSignatureList.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TEKSignatureList;
        })();
    
        covidshield.TEKSignature = (function() {
    
            /**
             * Properties of a TEKSignature.
             * @memberof covidshield
             * @interface ITEKSignature
             * @property {covidshield.ISignatureInfo|null} [signatureInfo] TEKSignature signatureInfo
             * @property {number|null} [batchNum] TEKSignature batchNum
             * @property {number|null} [batchSize] TEKSignature batchSize
             * @property {Uint8Array|null} [signature] TEKSignature signature
             */
    
            /**
             * Constructs a new TEKSignature.
             * @memberof covidshield
             * @classdesc Represents a TEKSignature.
             * @implements ITEKSignature
             * @constructor
             * @param {covidshield.ITEKSignature=} [properties] Properties to set
             */
            function TEKSignature(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TEKSignature signatureInfo.
             * @member {covidshield.ISignatureInfo|null|undefined} signatureInfo
             * @memberof covidshield.TEKSignature
             * @instance
             */
            TEKSignature.prototype.signatureInfo = null;
    
            /**
             * TEKSignature batchNum.
             * @member {number} batchNum
             * @memberof covidshield.TEKSignature
             * @instance
             */
            TEKSignature.prototype.batchNum = 0;
    
            /**
             * TEKSignature batchSize.
             * @member {number} batchSize
             * @memberof covidshield.TEKSignature
             * @instance
             */
            TEKSignature.prototype.batchSize = 0;
    
            /**
             * TEKSignature signature.
             * @member {Uint8Array} signature
             * @memberof covidshield.TEKSignature
             * @instance
             */
            TEKSignature.prototype.signature = $util.newBuffer([]);
    
            /**
             * Creates a new TEKSignature instance using the specified properties.
             * @function create
             * @memberof covidshield.TEKSignature
             * @static
             * @param {covidshield.ITEKSignature=} [properties] Properties to set
             * @returns {covidshield.TEKSignature} TEKSignature instance
             */
            TEKSignature.create = function create(properties) {
                return new TEKSignature(properties);
            };
    
            /**
             * Encodes the specified TEKSignature message. Does not implicitly {@link covidshield.TEKSignature.verify|verify} messages.
             * @function encode
             * @memberof covidshield.TEKSignature
             * @static
             * @param {covidshield.ITEKSignature} message TEKSignature message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TEKSignature.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.signatureInfo != null && Object.hasOwnProperty.call(message, "signatureInfo"))
                    $root.covidshield.SignatureInfo.encode(message.signatureInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.batchNum != null && Object.hasOwnProperty.call(message, "batchNum"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.batchNum);
                if (message.batchSize != null && Object.hasOwnProperty.call(message, "batchSize"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.batchSize);
                if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.signature);
                return writer;
            };
    
            /**
             * Encodes the specified TEKSignature message, length delimited. Does not implicitly {@link covidshield.TEKSignature.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.TEKSignature
             * @static
             * @param {covidshield.ITEKSignature} message TEKSignature message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TEKSignature.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TEKSignature message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.TEKSignature
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.TEKSignature} TEKSignature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TEKSignature.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.TEKSignature();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.signatureInfo = $root.covidshield.SignatureInfo.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.batchNum = reader.int32();
                        break;
                    case 3:
                        message.batchSize = reader.int32();
                        break;
                    case 4:
                        message.signature = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TEKSignature message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.TEKSignature
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.TEKSignature} TEKSignature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TEKSignature.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TEKSignature message.
             * @function verify
             * @memberof covidshield.TEKSignature
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TEKSignature.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.signatureInfo != null && message.hasOwnProperty("signatureInfo")) {
                    var error = $root.covidshield.SignatureInfo.verify(message.signatureInfo);
                    if (error)
                        return "signatureInfo." + error;
                }
                if (message.batchNum != null && message.hasOwnProperty("batchNum"))
                    if (!$util.isInteger(message.batchNum))
                        return "batchNum: integer expected";
                if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                    if (!$util.isInteger(message.batchSize))
                        return "batchSize: integer expected";
                if (message.signature != null && message.hasOwnProperty("signature"))
                    if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                        return "signature: buffer expected";
                return null;
            };
    
            /**
             * Creates a TEKSignature message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.TEKSignature
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.TEKSignature} TEKSignature
             */
            TEKSignature.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.TEKSignature)
                    return object;
                var message = new $root.covidshield.TEKSignature();
                if (object.signatureInfo != null) {
                    if (typeof object.signatureInfo !== "object")
                        throw TypeError(".covidshield.TEKSignature.signatureInfo: object expected");
                    message.signatureInfo = $root.covidshield.SignatureInfo.fromObject(object.signatureInfo);
                }
                if (object.batchNum != null)
                    message.batchNum = object.batchNum | 0;
                if (object.batchSize != null)
                    message.batchSize = object.batchSize | 0;
                if (object.signature != null)
                    if (typeof object.signature === "string")
                        $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                    else if (object.signature.length)
                        message.signature = object.signature;
                return message;
            };
    
            /**
             * Creates a plain object from a TEKSignature message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.TEKSignature
             * @static
             * @param {covidshield.TEKSignature} message TEKSignature
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TEKSignature.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.signatureInfo = null;
                    object.batchNum = 0;
                    object.batchSize = 0;
                    if (options.bytes === String)
                        object.signature = "";
                    else {
                        object.signature = [];
                        if (options.bytes !== Array)
                            object.signature = $util.newBuffer(object.signature);
                    }
                }
                if (message.signatureInfo != null && message.hasOwnProperty("signatureInfo"))
                    object.signatureInfo = $root.covidshield.SignatureInfo.toObject(message.signatureInfo, options);
                if (message.batchNum != null && message.hasOwnProperty("batchNum"))
                    object.batchNum = message.batchNum;
                if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                    object.batchSize = message.batchSize;
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
                return object;
            };
    
            /**
             * Converts this TEKSignature to JSON.
             * @function toJSON
             * @memberof covidshield.TEKSignature
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TEKSignature.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TEKSignature;
        })();
    
        return covidshield;
    })();
    
    $root.google = (function() {
    
        /**
         * Namespace google.
         * @exports google
         * @namespace
         */
        var google = {};
    
        google.protobuf = (function() {
    
            /**
             * Namespace protobuf.
             * @memberof google
             * @namespace
             */
            var protobuf = {};
    
            protobuf.Timestamp = (function() {
    
                /**
                 * Properties of a Timestamp.
                 * @memberof google.protobuf
                 * @interface ITimestamp
                 * @property {number|Long|null} [seconds] Timestamp seconds
                 * @property {number|null} [nanos] Timestamp nanos
                 */
    
                /**
                 * Constructs a new Timestamp.
                 * @memberof google.protobuf
                 * @classdesc Represents a Timestamp.
                 * @implements ITimestamp
                 * @constructor
                 * @param {google.protobuf.ITimestamp=} [properties] Properties to set
                 */
                function Timestamp(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Timestamp seconds.
                 * @member {number|Long} seconds
                 * @memberof google.protobuf.Timestamp
                 * @instance
                 */
                Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Timestamp nanos.
                 * @member {number} nanos
                 * @memberof google.protobuf.Timestamp
                 * @instance
                 */
                Timestamp.prototype.nanos = 0;
    
                /**
                 * Creates a new Timestamp instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.ITimestamp=} [properties] Properties to set
                 * @returns {google.protobuf.Timestamp} Timestamp instance
                 */
                Timestamp.create = function create(properties) {
                    return new Timestamp(properties);
                };
    
                /**
                 * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Timestamp.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                    if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                    return writer;
                };
    
                /**
                 * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Timestamp message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Timestamp} Timestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Timestamp.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.seconds = reader.int64();
                            break;
                        case 2:
                            message.nanos = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Timestamp message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.Timestamp} Timestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Timestamp.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Timestamp message.
                 * @function verify
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Timestamp.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                            return "seconds: integer|Long expected";
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        if (!$util.isInteger(message.nanos))
                            return "nanos: integer expected";
                    return null;
                };
    
                /**
                 * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.Timestamp} Timestamp
                 */
                Timestamp.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.Timestamp)
                        return object;
                    var message = new $root.google.protobuf.Timestamp();
                    if (object.seconds != null)
                        if ($util.Long)
                            (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                        else if (typeof object.seconds === "string")
                            message.seconds = parseInt(object.seconds, 10);
                        else if (typeof object.seconds === "number")
                            message.seconds = object.seconds;
                        else if (typeof object.seconds === "object")
                            message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                    if (object.nanos != null)
                        message.nanos = object.nanos | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.Timestamp} message Timestamp
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Timestamp.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.seconds = options.longs === String ? "0" : 0;
                        object.nanos = 0;
                    }
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        if (typeof message.seconds === "number")
                            object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                        else
                            object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        object.nanos = message.nanos;
                    return object;
                };
    
                /**
                 * Converts this Timestamp to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.Timestamp
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Timestamp.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Timestamp;
            })();
    
            protobuf.Duration = (function() {
    
                /**
                 * Properties of a Duration.
                 * @memberof google.protobuf
                 * @interface IDuration
                 * @property {number|Long|null} [seconds] Duration seconds
                 * @property {number|null} [nanos] Duration nanos
                 */
    
                /**
                 * Constructs a new Duration.
                 * @memberof google.protobuf
                 * @classdesc Represents a Duration.
                 * @implements IDuration
                 * @constructor
                 * @param {google.protobuf.IDuration=} [properties] Properties to set
                 */
                function Duration(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Duration seconds.
                 * @member {number|Long} seconds
                 * @memberof google.protobuf.Duration
                 * @instance
                 */
                Duration.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Duration nanos.
                 * @member {number} nanos
                 * @memberof google.protobuf.Duration
                 * @instance
                 */
                Duration.prototype.nanos = 0;
    
                /**
                 * Creates a new Duration instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {google.protobuf.IDuration=} [properties] Properties to set
                 * @returns {google.protobuf.Duration} Duration instance
                 */
                Duration.create = function create(properties) {
                    return new Duration(properties);
                };
    
                /**
                 * Encodes the specified Duration message. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {google.protobuf.IDuration} message Duration message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Duration.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                    if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                    return writer;
                };
    
                /**
                 * Encodes the specified Duration message, length delimited. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {google.protobuf.IDuration} message Duration message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Duration.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Duration message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Duration} Duration
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Duration.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Duration();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.seconds = reader.int64();
                            break;
                        case 2:
                            message.nanos = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Duration message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.Duration} Duration
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Duration.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Duration message.
                 * @function verify
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Duration.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                            return "seconds: integer|Long expected";
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        if (!$util.isInteger(message.nanos))
                            return "nanos: integer expected";
                    return null;
                };
    
                /**
                 * Creates a Duration message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.Duration} Duration
                 */
                Duration.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.Duration)
                        return object;
                    var message = new $root.google.protobuf.Duration();
                    if (object.seconds != null)
                        if ($util.Long)
                            (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                        else if (typeof object.seconds === "string")
                            message.seconds = parseInt(object.seconds, 10);
                        else if (typeof object.seconds === "number")
                            message.seconds = object.seconds;
                        else if (typeof object.seconds === "object")
                            message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                    if (object.nanos != null)
                        message.nanos = object.nanos | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Duration message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.Duration
                 * @static
                 * @param {google.protobuf.Duration} message Duration
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Duration.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.seconds = options.longs === String ? "0" : 0;
                        object.nanos = 0;
                    }
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        if (typeof message.seconds === "number")
                            object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                        else
                            object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        object.nanos = message.nanos;
                    return object;
                };
    
                /**
                 * Converts this Duration to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.Duration
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Duration.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Duration;
            })();
    
            return protobuf;
        })();
    
        return google;
    })();

    return $root;
});
