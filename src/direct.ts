/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
import { Base32Options, patchDefaultOptions } from './types';
import { partialThreeTwoDecode, partialThreeTwoEncode } from './engines';
import { getAlphabetFor } from './alphabets';

export function encode(buffer: Buffer | string, options?: Partial<Base32Options>) {
    options = patchDefaultOptions(options);
    const out = partialThreeTwoEncode(
        (typeof buffer === "string") ? Buffer.from(buffer) : buffer,
        options.alphabet || getAlphabetFor(options.flavour, false),
        0, 0, true,
        options.addPadding
    )[0];
    return options.encode === 'buffer' ? out : out.toString();
}

export function decode(buffer: Buffer | string, options?: Partial<Base32Options>) {
    options = patchDefaultOptions(options);
    const out = partialThreeTwoDecode(
        (typeof buffer === "string") ? Buffer.from(buffer) : buffer,
        options.alphabet || getAlphabetFor(options.flavour, true),
        0, 0, 0, true,
        options.checkPadding
    )[0];
    return options.encode === 'buffer' ? out : out.toString();
}
