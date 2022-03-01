import { Buffer } from "buffer";
import { Decoder, Encoder } from '../src/classes';

describe('class/encode', () => {

    test('behavioural', () => {

        // Update on finished
        expect(() => {
            const box = new Encoder();
            box.update('b5e46345192b68cbb38b02523dc4df05addde22603588d00e1c66f8d658f4e46');
            box.finish();
            box.update('b5e46345192b68cbb38b02523dc4df05addde22603588d00e1c66f8d658f4e46');
        }).toThrow();

    })

    test('vector_padded', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        const enc = new Encoder();
        const out = Buffer.concat([
            enc.update(Buffer.from(
                '585d7e92e998592fddef93459a1bc2447a9c38c58c7d50182531629dc71b35e944b42e' +
                '68f06a1e5e2f302b96bdf4cb59c8476bd2fd3e323962c1eab169e3be1318fcfbaada97c9'
                , 'hex')),
            enc.finish()
        ])

        expect(out.toString()).toEqual(
            'LBOX5EXJTBMS7XPPSNCZUG6CIR5JYOGFRR6VAGBFGFRJ3RY3GXUUJNBONDYGUHS6F' +
            '4YCXFV56TFVTSCHNPJP2PRSHFRMD2VRNHR34EYY7T52VWUXZE======'
        )

        // Multipart
        const enc2 = new Encoder();
        const out2 = Buffer.concat([
            enc2.update(Buffer.from('8b6381fbed27c2af1a2bc54772a4248f61e6b73047ce61a6', 'hex')),
            enc2.update(Buffer.from('631fdbaa1f6fd926ba1fbdba886a51ea8c1d92ff7e1bcde337f9805284c1c8', 'hex')),
            enc2.update(Buffer.from('4c8489d9e5124d6d0ccb7c33077191cbc1a8e73bbbcab3e497f0a02a8669faa73c2e00f19ea26d', 'hex')),
            enc2.update(Buffer.from('597819', 'hex')),
            enc2.finish()
        ]);

        expect(out2.toString()).toEqual(
            'RNRYD67NE7BK6GRLYVDXFJBER5Q6NNZQI7HGDJTDD7N2UH3P3ETLUH55XKEGUUPKR' +
            'QOZF736DPG6GN7ZQBJIJQOIJSCITWPFCJGW2DGLPQZQO4MRZPA2RZZ3XPFLHZEX6CQCVBTJ7KTTYLQA6GPKE3KZPAMQ===='
        )

    })

})


describe('class/decode', () => {

    test('behavioural', () => {

        // Update on finished
        expect(() => {
            const dec = new Decoder();
            dec.update('WXSGGRIZFNUMXM4LAJJD3RG7AWW53YRGANMI2AHBYZXY2ZMPJZDA====');
            dec.finish();
            dec.update('WXSGGRIZFNUMXM4LAJJD3RG7AWW53YRGANMI2AHBYZXY2ZMPJZDA====');
        }).toThrow();

    })

    test('vector_padded', () => {
        // used for vector generations : https://cryptii.com/pipes/hex-to-base32

        const dec = new Decoder();
        const out = Buffer.concat([
            dec.update(
                'LBOX5EXJTBMS7XPPSNCZUG6CIR5JYOGFRR6VAGBFGFRJ3RY3GXUUJNBONDYGUHS6F' +
                '4YCXFV56TFVTSCHNPJP2PRSHFRMD2VRNHR34EYY7T52VWUXZE======'
            ),
        ])
        dec.finish()
        expect(out).toEqual(Buffer.from(
            '585d7e92e998592fddef93459a1bc2447a9c38c58c7d50182531629dc71b35e944b42e' +
            '68f06a1e5e2f302b96bdf4cb59c8476bd2fd3e323962c1eab169e3be1318fcfbaada97c9'
            , 'hex'));

        // Multipart
        const dec2 = new Decoder();
        const out2 = Buffer.concat([
            dec2.update('RNRYD67NE7BK6GRLYVDXFJBER5Q6NNZQI7HGDJTDD7N2UH3')
            , dec2.update('P3ETLUH55XKEGUUPKR')
            , dec2.update('QOZF736DPG6GN7ZQBJIJQOIJSCITWPFCJGW2DGLPQZQO4MRZPA2R')
            , dec2.update('ZZ3XPFLHZEX6CQCVBTJ7KTTYLQA6GPKE3KZPAMQ====')
        ])
        dec.finish()
        expect(out2).toEqual(Buffer.from(
            '8b6381fbed27c2af1a2bc54772a4248f61e6b73047ce61a6631fdbaa1f6fd926ba1fbdba886a51e' +
            'a8c1d92ff7e1bcde337f9805284c1c84c8489d9e5124d6d0ccb7c33077191cbc1a8e73bbbcab3e4' +
            '97f0a02a8669faa73c2e00f19ea26d597819'
            , 'hex'));

    })

})
