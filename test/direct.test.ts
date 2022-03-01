import { Buffer } from "buffer";
import { decode, encode } from '../src/direct';

describe('encode', () => {

    test('behavioural', () => {

        expect(encode('foobar').toString())
            .toEqual('MZXW6YTBOI======');

        expect(encode('foobar', { addPadding: false }).toString())
            .toEqual('MZXW6YTBOI');

        expect(encode('foobar', { flavour: 'base32hex' }).toString())
            .toEqual('CPNMUOJ1E8======');

        expect(encode('foobar', { encode: 'string' }))
            .toEqual('MZXW6YTBOI======');

        expect(typeof encode('foobar', { encode: 'string' }))
            .toEqual('string')

        expect(encode('foobar', { encode: 'buffer' }) instanceof Buffer)
            .toEqual(true)

    })

    test('validation', () => {

    })

    test('rfc4648', () => {
        // examples on rfc4648 [page 13]

        expect(encode('').toString()).toEqual('');
        expect(encode('f').toString()).toEqual('MY======');
        expect(encode('fo').toString()).toEqual('MZXQ====');
        expect(encode('foo').toString()).toEqual('MZXW6===');
        expect(encode('foob').toString()).toEqual('MZXW6YQ=');
        expect(encode('fooba').toString()).toEqual('MZXW6YTB');
        expect(encode('foobar').toString()).toEqual('MZXW6YTBOI======');

    })

    test('vector_padded', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        expect(
            encode(Buffer.from(
                'b5e46345192b68cbb38b02523dc4df05addde22603588d00e1c66f8d658f4e46'
                , 'hex')).toString()
        ).toEqual(
            'WXSGGRIZFNUMXM4LAJJD3RG7AWW53YRGANMI2AHBYZXY2ZMPJZDA===='
        )
        expect(
            encode(Buffer.from(
                '585d7e92e998592fddef93459a1bc2447a9c38c58c7d50182531629dc71b35e944b42e' +
                '68f06a1e5e2f302b96bdf4cb59c8476bd2fd3e323962c1eab169e3be1318fcfbaada97c9'
                , 'hex')).toString()
        ).toEqual(
            'LBOX5EXJTBMS7XPPSNCZUG6CIR5JYOGFRR6VAGBFGFRJ3RY3GXUUJNBONDYGUHS6F' +
            '4YCXFV56TFVTSCHNPJP2PRSHFRMD2VRNHR34EYY7T52VWUXZE======'
        )

    })

    test('vector', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        expect(decode(
            'WXSGGRIZFNUMXM4LAJJD3RG7AWW53YRGANMI2AHBYZXY2ZMPJZDA'
            , { checkPadding: false }
        )).toEqual(Buffer.from(
            'b5e46345192b68cbb38b02523dc4df05addde22603588d00e1c66f8d658f4e46'
            , 'hex'));

        expect(decode(
            'LBOX5EXJTBMS7XPPSNCZUG6CIR5JYOGFRR6VAGBFGFRJ3RY3GXUUJNBONDYGUHS6F' +
            '4YCXFV56TFVTSCHNPJP2PRSHFRMD2VRNHR34EYY7T52VWUXZE'
            ,{ checkPadding: false }
        )).toEqual(Buffer.from(
            '585d7e92e998592fddef93459a1bc2447a9c38c58c7d50182531629dc71b35e944b42e' +
            '68f06a1e5e2f302b96bdf4cb59c8476bd2fd3e323962c1eab169e3be1318fcfbaada97c9'
            , 'hex'));

    })

})


describe('decode', () => {

    test('validation', () => {

        expect(() => decode('WXSGGRIZFNUMXM4LAJJD3RG7AWW53_RGANMI2AHBYZXY2ZMPJZDA====')).toThrow()
        expect(() => decode('WXSGGRIZFNUMXM4LAJJD3RG7AWW53_RGANMI2AHBYZXY2ZMPJZDA====.')).toThrow()
        expect(() => decode('WXSGGRIZFNUMXM4LAJJD3RG7AWW53_RGANMI2AHBYZXY2ZMPJZDA==')).toThrow()

    })

    test('vector_padded', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        expect(decode(
            'WXSGGRIZFNUMXM4LAJJD3RG7AWW53YRGANMI2AHBYZXY2ZMPJZDA===='
        )).toEqual(Buffer.from(
            'b5e46345192b68cbb38b02523dc4df05addde22603588d00e1c66f8d658f4e46'
            , 'hex'));

        expect(decode(
            'LBOX5EXJTBMS7XPPSNCZUG6CIR5JYOGFRR6VAGBFGFRJ3RY3GXUUJNBONDYGUHS6F' +
            '4YCXFV56TFVTSCHNPJP2PRSHFRMD2VRNHR34EYY7T52VWUXZE======'
        )).toEqual(Buffer.from(
            '585d7e92e998592fddef93459a1bc2447a9c38c58c7d50182531629dc71b35e944b42e' +
            '68f06a1e5e2f302b96bdf4cb59c8476bd2fd3e323962c1eab169e3be1318fcfbaada97c9'
            , 'hex'));

    })

})
