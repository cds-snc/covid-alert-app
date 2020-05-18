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
                        break;
                    }
                if (message.serverPublicKey != null && message.hasOwnProperty("serverPublicKey"))
                    if (!(message.serverPublicKey && typeof message.serverPublicKey.length === "number" || $util.isString(message.serverPublicKey)))
                        return "serverPublicKey: buffer expected";
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
                }
                if (object.serverPublicKey != null)
                    if (typeof object.serverPublicKey === "string")
                        $util.base64.decode(object.serverPublicKey, message.serverPublicKey = $util.newBuffer($util.base64.length(object.serverPublicKey)), 0);
                    else if (object.serverPublicKey.length)
                        message.serverPublicKey = object.serverPublicKey;
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
                }
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = options.enums === String ? $root.covidshield.KeyClaimResponse.ErrorCode[message.error] : message.error;
                if (message.serverPublicKey != null && message.hasOwnProperty("serverPublicKey"))
                    object.serverPublicKey = options.bytes === String ? $util.base64.encode(message.serverPublicKey, 0, message.serverPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.serverPublicKey) : message.serverPublicKey;
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
             */
            KeyClaimResponse.ErrorCode = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "NONE"] = 0;
                values[valuesById[1] = "UNKNOWN"] = 1;
                values[valuesById[2] = "INVALID_ONE_TIME_CODE"] = 2;
                values[valuesById[3] = "SERVER_ERROR"] = 3;
                values[valuesById[4] = "INVALID_KEY"] = 4;
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
                case "INVALID_ROLLING_START_NUMBER":
                case 12:
                    message.error = 12;
                    break;
                case "INVALID_TRANSMISSION_RISK_LEVEL":
                case 13:
                    message.error = 13;
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
             * @property {number} INVALID_ROLLING_START_NUMBER=12 INVALID_ROLLING_START_NUMBER value
             * @property {number} INVALID_TRANSMISSION_RISK_LEVEL=13 INVALID_TRANSMISSION_RISK_LEVEL value
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
                values[valuesById[12] = "INVALID_ROLLING_START_NUMBER"] = 12;
                values[valuesById[13] = "INVALID_TRANSMISSION_RISK_LEVEL"] = 13;
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
             * @property {Array.<covidshield.IKey>|null} [keys] Upload keys
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
             * @member {Array.<covidshield.IKey>} keys
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
                        $root.covidshield.Key.encode(message.keys[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                        message.keys.push($root.covidshield.Key.decode(reader, reader.uint32()));
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
                        var error = $root.covidshield.Key.verify(message.keys[i]);
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
                        message.keys[i] = $root.covidshield.Key.fromObject(object.keys[i]);
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
                        object.keys[j] = $root.covidshield.Key.toObject(message.keys[j], options);
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
    
        covidshield.File = (function() {
    
            /**
             * Properties of a File.
             * @memberof covidshield
             * @interface IFile
             * @property {covidshield.IHeader|null} [header] File header
             * @property {Array.<covidshield.IKey>|null} [key] File key
             */
    
            /**
             * Constructs a new File.
             * @memberof covidshield
             * @classdesc Represents a File.
             * @implements IFile
             * @constructor
             * @param {covidshield.IFile=} [properties] Properties to set
             */
            function File(properties) {
                this.key = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * File header.
             * @member {covidshield.IHeader|null|undefined} header
             * @memberof covidshield.File
             * @instance
             */
            File.prototype.header = null;
    
            /**
             * File key.
             * @member {Array.<covidshield.IKey>} key
             * @memberof covidshield.File
             * @instance
             */
            File.prototype.key = $util.emptyArray;
    
            /**
             * Creates a new File instance using the specified properties.
             * @function create
             * @memberof covidshield.File
             * @static
             * @param {covidshield.IFile=} [properties] Properties to set
             * @returns {covidshield.File} File instance
             */
            File.create = function create(properties) {
                return new File(properties);
            };
    
            /**
             * Encodes the specified File message. Does not implicitly {@link covidshield.File.verify|verify} messages.
             * @function encode
             * @memberof covidshield.File
             * @static
             * @param {covidshield.IFile} message File message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            File.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                    $root.covidshield.Header.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.key != null && message.key.length)
                    for (var i = 0; i < message.key.length; ++i)
                        $root.covidshield.Key.encode(message.key[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified File message, length delimited. Does not implicitly {@link covidshield.File.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.File
             * @static
             * @param {covidshield.IFile} message File message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            File.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a File message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.File
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.File} File
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            File.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.File();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.header = $root.covidshield.Header.decode(reader, reader.uint32());
                        break;
                    case 2:
                        if (!(message.key && message.key.length))
                            message.key = [];
                        message.key.push($root.covidshield.Key.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a File message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.File
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.File} File
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            File.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a File message.
             * @function verify
             * @memberof covidshield.File
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            File.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.header != null && message.hasOwnProperty("header")) {
                    var error = $root.covidshield.Header.verify(message.header);
                    if (error)
                        return "header." + error;
                }
                if (message.key != null && message.hasOwnProperty("key")) {
                    if (!Array.isArray(message.key))
                        return "key: array expected";
                    for (var i = 0; i < message.key.length; ++i) {
                        var error = $root.covidshield.Key.verify(message.key[i]);
                        if (error)
                            return "key." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a File message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.File
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.File} File
             */
            File.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.File)
                    return object;
                var message = new $root.covidshield.File();
                if (object.header != null) {
                    if (typeof object.header !== "object")
                        throw TypeError(".covidshield.File.header: object expected");
                    message.header = $root.covidshield.Header.fromObject(object.header);
                }
                if (object.key) {
                    if (!Array.isArray(object.key))
                        throw TypeError(".covidshield.File.key: array expected");
                    message.key = [];
                    for (var i = 0; i < object.key.length; ++i) {
                        if (typeof object.key[i] !== "object")
                            throw TypeError(".covidshield.File.key: object expected");
                        message.key[i] = $root.covidshield.Key.fromObject(object.key[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a File message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.File
             * @static
             * @param {covidshield.File} message File
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            File.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.key = [];
                if (options.defaults)
                    object.header = null;
                if (message.header != null && message.hasOwnProperty("header"))
                    object.header = $root.covidshield.Header.toObject(message.header, options);
                if (message.key && message.key.length) {
                    object.key = [];
                    for (var j = 0; j < message.key.length; ++j)
                        object.key[j] = $root.covidshield.Key.toObject(message.key[j], options);
                }
                return object;
            };
    
            /**
             * Converts this File to JSON.
             * @function toJSON
             * @memberof covidshield.File
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            File.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return File;
        })();
    
        covidshield.Header = (function() {
    
            /**
             * Properties of a Header.
             * @memberof covidshield
             * @interface IHeader
             * @property {number|Long|null} [startTimestamp] Header startTimestamp
             * @property {number|Long|null} [endTimestamp] Header endTimestamp
             * @property {string|null} [region] Header region
             * @property {number|null} [batchNum] Header batchNum
             * @property {number|null} [batchSize] Header batchSize
             */
    
            /**
             * Constructs a new Header.
             * @memberof covidshield
             * @classdesc Represents a Header.
             * @implements IHeader
             * @constructor
             * @param {covidshield.IHeader=} [properties] Properties to set
             */
            function Header(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Header startTimestamp.
             * @member {number|Long} startTimestamp
             * @memberof covidshield.Header
             * @instance
             */
            Header.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Header endTimestamp.
             * @member {number|Long} endTimestamp
             * @memberof covidshield.Header
             * @instance
             */
            Header.prototype.endTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Header region.
             * @member {string} region
             * @memberof covidshield.Header
             * @instance
             */
            Header.prototype.region = "";
    
            /**
             * Header batchNum.
             * @member {number} batchNum
             * @memberof covidshield.Header
             * @instance
             */
            Header.prototype.batchNum = 0;
    
            /**
             * Header batchSize.
             * @member {number} batchSize
             * @memberof covidshield.Header
             * @instance
             */
            Header.prototype.batchSize = 0;
    
            /**
             * Creates a new Header instance using the specified properties.
             * @function create
             * @memberof covidshield.Header
             * @static
             * @param {covidshield.IHeader=} [properties] Properties to set
             * @returns {covidshield.Header} Header instance
             */
            Header.create = function create(properties) {
                return new Header(properties);
            };
    
            /**
             * Encodes the specified Header message. Does not implicitly {@link covidshield.Header.verify|verify} messages.
             * @function encode
             * @memberof covidshield.Header
             * @static
             * @param {covidshield.IHeader} message Header message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Header.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.startTimestamp);
                if (message.endTimestamp != null && Object.hasOwnProperty.call(message, "endTimestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.endTimestamp);
                if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.region);
                if (message.batchNum != null && Object.hasOwnProperty.call(message, "batchNum"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.batchNum);
                if (message.batchSize != null && Object.hasOwnProperty.call(message, "batchSize"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.batchSize);
                return writer;
            };
    
            /**
             * Encodes the specified Header message, length delimited. Does not implicitly {@link covidshield.Header.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.Header
             * @static
             * @param {covidshield.IHeader} message Header message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Header.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Header message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.Header
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.Header} Header
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Header.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.Header();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.startTimestamp = reader.int64();
                        break;
                    case 2:
                        message.endTimestamp = reader.int64();
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
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Header message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.Header
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.Header} Header
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Header.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Header message.
             * @function verify
             * @memberof covidshield.Header
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Header.verify = function verify(message) {
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
                return null;
            };
    
            /**
             * Creates a Header message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.Header
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.Header} Header
             */
            Header.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.Header)
                    return object;
                var message = new $root.covidshield.Header();
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
                return message;
            };
    
            /**
             * Creates a plain object from a Header message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.Header
             * @static
             * @param {covidshield.Header} message Header
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Header.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
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
                return object;
            };
    
            /**
             * Converts this Header to JSON.
             * @function toJSON
             * @memberof covidshield.Header
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Header.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Header;
        })();
    
        covidshield.Key = (function() {
    
            /**
             * Properties of a Key.
             * @memberof covidshield
             * @interface IKey
             * @property {Uint8Array|null} [keyData] Key keyData
             * @property {number|null} [rollingStartNumber] Key rollingStartNumber
             * @property {number|null} [rollingPeriod] Key rollingPeriod
             * @property {number|null} [transmissionRiskLevel] Key transmissionRiskLevel
             */
    
            /**
             * Constructs a new Key.
             * @memberof covidshield
             * @classdesc Represents a Key.
             * @implements IKey
             * @constructor
             * @param {covidshield.IKey=} [properties] Properties to set
             */
            function Key(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Key keyData.
             * @member {Uint8Array} keyData
             * @memberof covidshield.Key
             * @instance
             */
            Key.prototype.keyData = $util.newBuffer([]);
    
            /**
             * Key rollingStartNumber.
             * @member {number} rollingStartNumber
             * @memberof covidshield.Key
             * @instance
             */
            Key.prototype.rollingStartNumber = 0;
    
            /**
             * Key rollingPeriod.
             * @member {number} rollingPeriod
             * @memberof covidshield.Key
             * @instance
             */
            Key.prototype.rollingPeriod = 0;
    
            /**
             * Key transmissionRiskLevel.
             * @member {number} transmissionRiskLevel
             * @memberof covidshield.Key
             * @instance
             */
            Key.prototype.transmissionRiskLevel = 0;
    
            /**
             * Creates a new Key instance using the specified properties.
             * @function create
             * @memberof covidshield.Key
             * @static
             * @param {covidshield.IKey=} [properties] Properties to set
             * @returns {covidshield.Key} Key instance
             */
            Key.create = function create(properties) {
                return new Key(properties);
            };
    
            /**
             * Encodes the specified Key message. Does not implicitly {@link covidshield.Key.verify|verify} messages.
             * @function encode
             * @memberof covidshield.Key
             * @static
             * @param {covidshield.IKey} message Key message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Key.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.keyData != null && Object.hasOwnProperty.call(message, "keyData"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.keyData);
                if (message.rollingStartNumber != null && Object.hasOwnProperty.call(message, "rollingStartNumber"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.rollingStartNumber);
                if (message.rollingPeriod != null && Object.hasOwnProperty.call(message, "rollingPeriod"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.rollingPeriod);
                if (message.transmissionRiskLevel != null && Object.hasOwnProperty.call(message, "transmissionRiskLevel"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.transmissionRiskLevel);
                return writer;
            };
    
            /**
             * Encodes the specified Key message, length delimited. Does not implicitly {@link covidshield.Key.verify|verify} messages.
             * @function encodeDelimited
             * @memberof covidshield.Key
             * @static
             * @param {covidshield.IKey} message Key message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Key.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Key message from the specified reader or buffer.
             * @function decode
             * @memberof covidshield.Key
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {covidshield.Key} Key
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Key.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.covidshield.Key();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.keyData = reader.bytes();
                        break;
                    case 2:
                        message.rollingStartNumber = reader.uint32();
                        break;
                    case 3:
                        message.rollingPeriod = reader.uint32();
                        break;
                    case 4:
                        message.transmissionRiskLevel = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Key message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof covidshield.Key
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {covidshield.Key} Key
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Key.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Key message.
             * @function verify
             * @memberof covidshield.Key
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Key.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.keyData != null && message.hasOwnProperty("keyData"))
                    if (!(message.keyData && typeof message.keyData.length === "number" || $util.isString(message.keyData)))
                        return "keyData: buffer expected";
                if (message.rollingStartNumber != null && message.hasOwnProperty("rollingStartNumber"))
                    if (!$util.isInteger(message.rollingStartNumber))
                        return "rollingStartNumber: integer expected";
                if (message.rollingPeriod != null && message.hasOwnProperty("rollingPeriod"))
                    if (!$util.isInteger(message.rollingPeriod))
                        return "rollingPeriod: integer expected";
                if (message.transmissionRiskLevel != null && message.hasOwnProperty("transmissionRiskLevel"))
                    if (!$util.isInteger(message.transmissionRiskLevel))
                        return "transmissionRiskLevel: integer expected";
                return null;
            };
    
            /**
             * Creates a Key message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof covidshield.Key
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {covidshield.Key} Key
             */
            Key.fromObject = function fromObject(object) {
                if (object instanceof $root.covidshield.Key)
                    return object;
                var message = new $root.covidshield.Key();
                if (object.keyData != null)
                    if (typeof object.keyData === "string")
                        $util.base64.decode(object.keyData, message.keyData = $util.newBuffer($util.base64.length(object.keyData)), 0);
                    else if (object.keyData.length)
                        message.keyData = object.keyData;
                if (object.rollingStartNumber != null)
                    message.rollingStartNumber = object.rollingStartNumber >>> 0;
                if (object.rollingPeriod != null)
                    message.rollingPeriod = object.rollingPeriod >>> 0;
                if (object.transmissionRiskLevel != null)
                    message.transmissionRiskLevel = object.transmissionRiskLevel | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a Key message. Also converts values to other types if specified.
             * @function toObject
             * @memberof covidshield.Key
             * @static
             * @param {covidshield.Key} message Key
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Key.toObject = function toObject(message, options) {
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
                    object.rollingStartNumber = 0;
                    object.rollingPeriod = 0;
                    object.transmissionRiskLevel = 0;
                }
                if (message.keyData != null && message.hasOwnProperty("keyData"))
                    object.keyData = options.bytes === String ? $util.base64.encode(message.keyData, 0, message.keyData.length) : options.bytes === Array ? Array.prototype.slice.call(message.keyData) : message.keyData;
                if (message.rollingStartNumber != null && message.hasOwnProperty("rollingStartNumber"))
                    object.rollingStartNumber = message.rollingStartNumber;
                if (message.rollingPeriod != null && message.hasOwnProperty("rollingPeriod"))
                    object.rollingPeriod = message.rollingPeriod;
                if (message.transmissionRiskLevel != null && message.hasOwnProperty("transmissionRiskLevel"))
                    object.transmissionRiskLevel = message.transmissionRiskLevel;
                return object;
            };
    
            /**
             * Converts this Key to JSON.
             * @function toJSON
             * @memberof covidshield.Key
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Key.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Key;
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
    
            return protobuf;
        })();
    
        return google;
    })();

    return $root;
});
