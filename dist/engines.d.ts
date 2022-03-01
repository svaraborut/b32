/// <reference types="node" />
/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
import { BaseAlphabet } from './types';
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
export declare function partialThreeTwoEncode(decoded: Buffer, alphabet: BaseAlphabet, carry: number, carryLength: number, complete?: boolean, addPadding?: boolean): [Buffer, number, number];
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
export declare function partialThreeTwoDecode(encoded: Buffer | null, alphabet: BaseAlphabet, carry: number, carryLength: number, padding: number, complete?: boolean, checkPadding?: boolean): [Buffer, number, number, number];
