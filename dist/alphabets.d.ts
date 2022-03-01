/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
import { Base32Flavour, BaseAlphabet } from './types';
export declare function encodeAlphabetFromString(lemma: string): BaseAlphabet;
export declare function decodeAlphabetFromString(lemma: string): BaseAlphabet;
export declare function getAlphabetFor(name: Base32Flavour, forDecode?: boolean): BaseAlphabet;
