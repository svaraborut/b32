import { Buffer } from "buffer";
import { Base32Options } from '../src/types';
import { decode, encode } from '../src/direct';
import { decodeAlphabetFromString, encodeAlphabetFromString } from '../src/alphabets';

describe('encode', () => {

    test('rfc4648_hex', () => {
        // examples on rfc4648 [page 13]

        const opts: Partial<Base32Options> = {addPadding: true, flavour: 'base32hex'};
        expect(encode('', opts).toString()).toEqual('');
        expect(encode('f', opts).toString()).toEqual('CO======');
        expect(encode('fo', opts).toString()).toEqual('CPNG====');
        expect(encode('foo', opts).toString()).toEqual('CPNMU===');
        expect(encode('foob', opts).toString()).toEqual('CPNMUOG=');
        expect(encode('fooba', opts).toString()).toEqual('CPNMUOJ1');
        expect(encode('foobar', opts).toString()).toEqual('CPNMUOJ1E8======');

    })

})

describe('decode', () => {

    test('base32hex', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        expect(decode('VV50EJ0SALC5Q85SPB5JQA2FKUIJD5TF4G======', { checkPadding: true, flavour: 'base32hex' }))
            .toEqual(Buffer.from('ffca074c1c55585d20bccacb3d284fa7a53697af24', 'hex'));

        expect(decode('90D9G9SRT9QM9BBTU5IU29LH2P5AAV3QGK', { checkPadding: false, flavour: 'base32hex' }))
            .toEqual(Buffer.from('481a98279bea7564ad7df165e126b1164aa57c7a85', 'hex'));

    })

    test('zBase32', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        expect(decode('asnmikes3z6qi46a4py1bwrbogp6hghedy======', { checkPadding: true, flavour: 'zBase32' }))
            .toEqual(Buffer.from('c584baa916cdfceaebd8d34120d081819bee1b8818', 'hex'));

        expect(decode('s93ffra6yo85zdea5rifouqita9zma7nre', { checkPadding: false, flavour: 'zBase32' }))
            .toEqual(Buffer.from('b7f252931e040fbb8d18d92a584dd58e3f75e3a222', 'hex'));

    })

    test('crockford32', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        expect(decode('2253Z6579DV04BK7KN4CBM85Y8HG48SFS8======', { checkPadding: true, flavour: 'crockford32' }))
            .toEqual(Buffer.from('108a3f98a74b76022e679d48c5d105f22302232fca', 'hex'));

        expect(decode('8EHCMQBN1GBNET4XNW5N4J7DMAHTG3FVQR', { checkPadding: false, flavour: 'crockford32' }))
            .toEqual(Buffer.from('43a2ca5d750c1757689daf0b5248eda2a3a80dfbbe', 'hex'));

    })

})

describe('custom', () => {

    test('encode', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        const alphabet = encodeAlphabetFromString('qwerlkjhgfzxcvbMNBVASDFGHPOIUYTR')
        expect(encode(Buffer.from('94f90899009dc3c22dabe8fca7c33cc5608425092fe465cff131be17', 'hex'), { addPadding: true, alphabet }))
            .toEqual(Buffer.from('VAUNBjgqAGwUlxvxYrTzMNPUHDNggfgfkRVjxARBjjRwb==='));

    })

    test('decode', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        // detect two types of alphabet:
        // qwerlkjhgfzxcvbMNBVASDFGHPOIUYTR
        // qWerlK1hgfzxcvbMNBVASDFGHPOIUYLR
        const alphabet = decodeAlphabetFromString('q wW e r l kK j1 h g f z x c v b M N B V A S D F G H P O I U Y TL R')

        expect(decode('VAUNBjgqAGwUlxvxYrTzMNPUHDNggfgfkRVjxARBjjRwb===', { checkPadding: true, alphabet }))
            .toEqual(Buffer.from('94f90899009dc3c22dabe8fca7c33cc5608425092fe465cff131be17', 'hex'));

        expect(decode('VAUNB1gqAGWUlxvxYrLzMNPUHDNggfgfKRV1xARB11RWb===', { checkPadding: true, alphabet }))
            .toEqual(Buffer.from('94f90899009dc3c22dabe8fca7c33cc5608425092fe465cff131be17', 'hex'));

    })

})

