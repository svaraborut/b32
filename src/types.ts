/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */

export type BaseAlphabet = number[] | { [K: string]: number };

export type Base32Flavour = 'base32' | 'base32hex' | 'zBase32' | 'crockford32' | 'geohash' | 'wordsafe';

export interface Base32Options {
    flavour: Base32Flavour;
    addPadding: boolean;
    checkPadding: boolean;
    encode: 'string' | 'buffer';
    alphabet: BaseAlphabet;
}

let __defaultOptions: Base32Options = {
    flavour: 'base32',
    addPadding: true,
    checkPadding: false,
    alphabet: undefined,
    // todo : think what to have as default output encoding
    // todo : maybe have different from decode and encode
    encode: 'buffer',
}

export function updateDefaultOptions(options?: Partial<Base32Options>): void {
    __defaultOptions = patchDefaultOptions(options);
}

export function patchDefaultOptions(options?: Partial<Base32Options>): Base32Options {
    return { ...__defaultOptions, ...(options || {}) };
}
