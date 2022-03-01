/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
import { Base32Options, BaseAlphabet, patchDefaultOptions } from './types';
import { getAlphabetFor } from './alphabets';
import { partialThreeTwoDecode, partialThreeTwoEncode } from './engines';
import * as stream from 'stream';
import { TransformCallback } from 'stream';

export class Encoder extends stream.Transform {
    readonly options: Base32Options;
    readonly alphabet: BaseAlphabet;

    private carryLength = 0;
    private carry = 0;
    private finished = false;

    constructor(options?: Partial<Base32Options>) {
        super();
        this.options = options = patchDefaultOptions(options);
        this.alphabet = options.alphabet || getAlphabetFor('base32', false);
    }

    update(buffer: Buffer | string): Buffer {
        if (this.finished) {
            throw new Error('Can not call update() on a finished encoder');
        }
        let out;
        [out, this.carry, this.carryLength] = partialThreeTwoEncode(
            (typeof buffer === "string") ? Buffer.from(buffer) : buffer,
            this.alphabet,
            this.carry,
            this.carryLength,
            false,
            false
        );
        return out;
    }

    finish(): Buffer {
        this.finished = true;
        const [out] = partialThreeTwoEncode(
            null,
            this.alphabet,
            this.carry,
            this.carryLength,
            true,
            this.options.addPadding
        );
        return out;
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            this.push(this.update(chunk));
            callback();
        } catch (e) {
            callback(e);
        }
    }

    _flush(callback: TransformCallback) {
        try {
            const f = this.finish();
            this.push(f);
            callback();
        } catch (e) {
            callback(e);
        }
    }

}

export class Decoder extends stream.Transform {
    readonly options: Base32Options;
    readonly alphabet: BaseAlphabet;

    private carryLength = 0;
    private carry = 0;
    private finished = false;
    private padding = 0;

    constructor(options?: Partial<Base32Options>) {
        super();
        this.options = options = patchDefaultOptions(options);
        this.alphabet = options.alphabet || getAlphabetFor('base32', true);
    }

    update(buffer: Buffer | string): Buffer {
        if (this.finished) {
            throw new Error('Can not call update() on a finished decoder');
        }
        let out;
        [out, this.carry, this.carryLength, this.padding] = partialThreeTwoDecode(
            (typeof buffer === "string") ? Buffer.from(buffer) : buffer,
            this.alphabet,
            this.carry,
            this.carryLength,
            this.padding,
            false,
            false
        );
        return out;
    }

    finish(): void {
        this.finished = true;
        partialThreeTwoDecode(
            null,
            this.alphabet,
            this.carry,
            this.carryLength,
            this.padding,
            true,
            this.options.checkPadding
        );
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            this.push(this.update(chunk));
            callback();
        } catch (e) {
            callback(e);
        }
    }

    _flush(callback: TransformCallback) {
        try {
            this.finish();
            callback();
        } catch (e) {
            callback(e);
        }
    }

}
