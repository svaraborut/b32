"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialThreeTwoDecode = exports.partialThreeTwoEncode = void 0;
// Padding alignment map
// RFC4648 ~ 6
//
// XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXX
// 11111222 22333334 44445555 56666677 77788888
//       +3       +1       +4       +2        0  (5-alignment)
//    !5    +2   !7    +4    +1   !6    +3       (8-aligned, ! indicates invalid alignment)
//
//      from64  to64    padding
//      0       0
//      1       4       ====
//      2       3       =
//      3       2       ======
//      4       1       ===
var FP_MAP = { 0: 0, 3: 6, 1: 4, 4: 3, 2: 1 };
var IP_MAP = { 0: 0, 1: 3, 2: 6, 3: 1, 4: 4 };
/**
 * A partial encoding function, it can be used to convert
 * a Buffer to an isolate Base32 string, or can be called
 * sequentially by providing carry from previous cycles.
 *
 * Internally uses buffer, it has been observed that string
 * concatenation is more effective when dealing with small
 * 16~32 byte inputs.
 * todo : evaluate an automatic switch
 *
 * @param decoded ~ the Binary input buffer
 * @param alphabet ~ transformation alphabet
 * @param carry ~ part of the last byte from the previous chunk (if conversion is not isolated)
 * @param carryLength ~ length in bits of the carry
 * @param complete ~ weather this call should complete the conversion and hence output last char
 *                   and padding. After a complete call returned carry will be empty
 * @param addPadding ~ weather padding should be added at the end
 *
 * @returns [buffer, carry, carryLength] ~ returns the converted buffer and carry
 */
function partialThreeTwoEncode(decoded, alphabet, carry, carryLength, complete, addPadding) {
    if (complete === void 0) { complete = true; }
    if (addPadding === void 0) { addPadding = true; }
    // > Progressive
    var readOff = 0, off = 0, buffer = Buffer.alloc(Math.ceil(((decoded && decoded.length) + carryLength / 8) / 5) * 8);
    if (decoded) {
        while (readOff < decoded.byteLength || carryLength >= 5) {
            // Starving values
            if (carryLength < 5) {
                carry = carry << 8 | decoded.readUInt8(readOff++);
                carryLength += 8;
            }
            // Extract
            buffer.writeUInt8(alphabet[(carry >> (carryLength - 5)) & 0x1f], off++);
            carry = carry & 0xff; // just to prevent overflow
            carryLength -= 5;
        }
    }
    // > Finish up
    if (complete) {
        // Padding check
        if (FP_MAP[carryLength] === undefined) {
            throw new Error('Invalid alignment');
        }
        // Last part
        if (carryLength !== 0) {
            buffer.writeUInt8(alphabet[(carry << (5 - carryLength)) & 0x1f], off++);
        }
        if (addPadding) {
            for (var i = 0; i < FP_MAP[carryLength]; ++i) {
                buffer.writeUInt8(0x3d /* = */, off++);
            }
        }
        carry = 0x00;
        carryLength = 0;
    }
    return [buffer.slice(0, off), carry, carryLength];
}
exports.partialThreeTwoEncode = partialThreeTwoEncode;
/**
 * A partial decoding function, it can be used to convert
 * a Buffer from an isolate Base32 string, or can be called
 * sequentially by providing carry from previous cycles.
 *
 * @param encoded ~ the Binary string containing Base64 encoded string
 * @param alphabet ~ transformation alphabet
 * @param carry ~ part of the last byte from the previous chunk (if conversion is not isolated)
 * @param carryLength ~ length in bits of the carry
 * @param padding ~ a carried counter used to validate padding after completion
 * @param complete ~ weather this call should complete the conversion and hence output last char
 *                   and padding. After a complete call returned carry will be empty
 * @param checkPadding ~ weather padding should be validated
 */
function partialThreeTwoDecode(encoded, alphabet, carry, carryLength, padding, complete, checkPadding) {
    if (complete === void 0) { complete = true; }
    if (checkPadding === void 0) { checkPadding = true; }
    // > Progressive
    var off = 0, buffer = null;
    if (encoded) {
        buffer = Buffer.alloc(Math.ceil((encoded.length * 5 + carryLength) / 8));
        for (var i = 0; i < encoded.length; ++i) {
            var encIx = encoded[i];
            // Padding
            if (encIx === 0x3D /* shifted '=' */) {
                padding += 1;
                continue;
            }
            else if (padding > 0) {
                throw new TypeError('Malformed padding');
            }
            // Value checks
            var value = alphabet[encIx];
            if (value === undefined) {
                throw new TypeError("Malformed encoding at '" + encoded[i].toString() + "'");
            }
            // Push values
            carry = (carry << 5) | value;
            carryLength += 5;
            // Extract
            if (carryLength >= 8) {
                buffer.writeUInt8((carry >> (carryLength - 8)) & 0xff, off++);
                carry = carry & 0xff; // just to prevent overflow
                carryLength -= 8;
            }
        }
    }
    // > Finish up
    if (complete && checkPadding) {
        // Verify padding
        if (IP_MAP[carryLength] === undefined
            || IP_MAP[carryLength] !== padding) {
            throw new Error('Invalid alignment');
        }
        // Carry while decoding is throw away
    }
    return [buffer && buffer.slice(0, off), carry, carryLength, padding];
}
exports.partialThreeTwoDecode = partialThreeTwoDecode;
