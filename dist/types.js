"use strict";
/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchDefaultOptions = exports.updateDefaultOptions = void 0;
var __defaultOptions = {
    flavour: 'base32',
    addPadding: true,
    checkPadding: false,
    alphabet: undefined,
    // todo : think what to have as default output encoding
    // todo : maybe have different from decode and encode
    encode: 'buffer',
};
function updateDefaultOptions(options) {
    __defaultOptions = patchDefaultOptions(options);
}
exports.updateDefaultOptions = updateDefaultOptions;
function patchDefaultOptions(options) {
    return __assign(__assign({}, __defaultOptions), (options || {}));
}
exports.patchDefaultOptions = patchDefaultOptions;
