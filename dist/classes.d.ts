/// <reference types="node" />
/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
import { Base32Options, BaseAlphabet } from './types';
import * as stream from 'stream';
import { TransformCallback } from 'stream';
export declare class Encoder extends stream.Transform {
    readonly options: Base32Options;
    readonly alphabet: BaseAlphabet;
    private carryLength;
    private carry;
    private finished;
    constructor(options?: Partial<Base32Options>);
    update(buffer: Buffer | string): Buffer;
    finish(): Buffer;
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
}
export declare class Decoder extends stream.Transform {
    readonly options: Base32Options;
    readonly alphabet: BaseAlphabet;
    private carryLength;
    private carry;
    private finished;
    private padding;
    constructor(options?: Partial<Base32Options>);
    update(buffer: Buffer | string): Buffer;
    finish(): void;
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
}
