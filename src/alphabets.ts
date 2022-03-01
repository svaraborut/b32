/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */

import { Base32Flavour, BaseAlphabet } from './types';

/**
 * A common library of alphabets someone may need.
 */
const defaultAlphabetStrings = {

    // RFC4648 § 6 - compliant alphabets

    'base32': {
        encode: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
        decode: 'aA bB cC dD eE fF gG hH iI jJ kK lL mM nN oO pP qQ rR sS tT uU vV wW xX yY zZ 2 3 4 5 6 7',
    },

    'base32hex': {
        encode: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
        decode: '0 1 2 3 4 5 6 7 8 9 aA bB cC dD eE fF gG hH iI jJ kK lL mM nN oO pP qQ rR sS tT uU vV',
    },

    // non standard alphabets
    // https://en.wikipedia.org/wiki/Base32

    'zbase32': {
        encode: 'ybndrfg8ejkmcpqxot1uwisza345h769',
        decode: 'yY bB nN dD rR fF gG 8 eE jJ kK mM cC pP qQ xX oO tT 1 uU wW iI sS zZ aA 3 4 5 hH 7 6 9',
    },

    'crockford32': {
        encode: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
        decode: '0oO 1iIlL 2 3 4 5 6 7 8 9 aA bB cC dD eE fF gG hH jJ kK mM nN pP qQ rR sS tT vV wW xX yY zZ',
    },

    'geohash': {
        encode: '0123456789bcdefghjkmnpqrstuvwxyz',
        decode: '0 1 2 3 4 5 6 7 8 9 bB cC dD eE fF gG hH jJ kK mM nN pP qQ rR sS tT uU vV wW xX yY zZ',
    },

    'wordsafe': {
        encode: '23456789CFGHJMPQRVWXcfghjmpqrvwx',
        decode: '2 3 4 5 6 7 8 9 C F G H J M P Q R V W X c f g h j m p q r v w x',
    },

}

export function encodeAlphabetFromString(lemma: string): BaseAlphabet {
    const c = lemma.split('');
    if (c.length !== 32) throw new Error('No 32 chars');
    return c.map(l => l.charCodeAt(0));
}

export function decodeAlphabetFromString(lemma: string): BaseAlphabet {
    const g = lemma.split(' ');
    if (g.length !== 32) throw new Error('No 32 groups');
    const l = {};
    g.forEach((c, i) => c.split('').forEach(cc => {
        // i   = numeric value [0-32]
        // cc  = a character string
        if (l[cc.charCodeAt(0)]) throw new Error(`Duplicated character ${cc}`);
        l[cc.charCodeAt(0)] = i
    }));
    return l;
}

const parsingCache
    : { [K: string]: { encode: BaseAlphabet, decode :BaseAlphabet }}
    = {};

export function getAlphabetFor(name: Base32Flavour, forDecode: boolean = false) {
    name = name.toLowerCase() as any;
    // Populate cache only when needed, to avoid wasting space for
    // unused flavour LTUs.
    if (!parsingCache[name]) {
        if (!defaultAlphabetStrings[name]) {
            throw new Error(`Unknown Base32 flavour '${name}'`);
        }
        const strings = defaultAlphabetStrings[name];
        parsingCache[name] = {
            encode: encodeAlphabetFromString(strings.encode),
            decode: decodeAlphabetFromString(strings.decode),
        }
    }

    const ltu = parsingCache[name];
    return forDecode ? ltu.decode : ltu.encode;
}
