/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
export declare type BaseAlphabet = number[] | {
    [K: string]: number;
};
export declare type Base32Flavour = 'base32' | 'base32hex' | 'zBase32' | 'crockford32' | 'geohash' | 'wordsafe';
export interface Base32Options {
    flavour: Base32Flavour;
    addPadding: boolean;
    checkPadding: boolean;
    encode: 'string' | 'buffer';
    alphabet: BaseAlphabet;
}
export declare function updateDefaultOptions(options?: Partial<Base32Options>): void;
export declare function patchDefaultOptions(options?: Partial<Base32Options>): Base32Options;
