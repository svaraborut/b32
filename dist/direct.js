"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
var types_1 = require("./types");
var engines_1 = require("./engines");
var alphabets_1 = require("./alphabets");
function encode(buffer, options) {
    options = types_1.patchDefaultOptions(options);
    var out = engines_1.partialThreeTwoEncode((typeof buffer === "string") ? Buffer.from(buffer) : buffer, options.alphabet || alphabets_1.getAlphabetFor(options.flavour, false), 0, 0, true, options.addPadding)[0];
    return options.encode === 'buffer' ? out : out.toString();
}
exports.encode = encode;
function decode(buffer, options) {
    options = types_1.patchDefaultOptions(options);
    var out = engines_1.partialThreeTwoDecode((typeof buffer === "string") ? Buffer.from(buffer) : buffer, options.alphabet || alphabets_1.getAlphabetFor(options.flavour, true), 0, 0, 0, true, options.checkPadding)[0];
    return options.encode === 'buffer' ? out : out.toString();
}
exports.decode = decode;
