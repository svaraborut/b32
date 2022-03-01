/// <reference types="node" />
/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
import { Base32Options } from './types';
export declare function encode(buffer: Buffer | string, options?: Partial<Base32Options>): string | Buffer;
export declare function decode(buffer: Buffer | string, options?: Partial<Base32Options>): string | Buffer;
