"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.Encoder = void 0;
/**
 * @author svaraborut
 * @copyright 2021
 * @web https://github.com/svaraborut/b32
 */
var types_1 = require("./types");
var alphabets_1 = require("./alphabets");
var engines_1 = require("./engines");
var stream = __importStar(require("stream"));
var Encoder = /** @class */ (function (_super) {
    __extends(Encoder, _super);
    function Encoder(options) {
        var _this = _super.call(this) || this;
        _this.carryLength = 0;
        _this.carry = 0;
        _this.finished = false;
        _this.options = options = types_1.patchDefaultOptions(options);
        _this.alphabet = options.alphabet || alphabets_1.getAlphabetFor('base32', false);
        return _this;
    }
    Encoder.prototype.update = function (buffer) {
        var _a;
        if (this.finished) {
            throw new Error('Can not call update() on a finished encoder');
        }
        var out;
        _a = engines_1.partialThreeTwoEncode((typeof buffer === "string") ? Buffer.from(buffer) : buffer, this.alphabet, this.carry, this.carryLength, false, false), out = _a[0], this.carry = _a[1], this.carryLength = _a[2];
        return out;
    };
    Encoder.prototype.finish = function () {
        this.finished = true;
        var out = engines_1.partialThreeTwoEncode(null, this.alphabet, this.carry, this.carryLength, true, this.options.addPadding)[0];
        return out;
    };
    Encoder.prototype._transform = function (chunk, encoding, callback) {
        try {
            this.push(this.update(chunk));
            callback();
        }
        catch (e) {
            callback(e);
        }
    };
    Encoder.prototype._flush = function (callback) {
        try {
            var f = this.finish();
            this.push(f);
            callback();
        }
        catch (e) {
            callback(e);
        }
    };
    return Encoder;
}(stream.Transform));
exports.Encoder = Encoder;
var Decoder = /** @class */ (function (_super) {
    __extends(Decoder, _super);
    function Decoder(options) {
        var _this = _super.call(this) || this;
        _this.carryLength = 0;
        _this.carry = 0;
        _this.finished = false;
        _this.padding = 0;
        _this.options = options = types_1.patchDefaultOptions(options);
        _this.alphabet = options.alphabet || alphabets_1.getAlphabetFor('base32', true);
        return _this;
    }
    Decoder.prototype.update = function (buffer) {
        var _a;
        if (this.finished) {
            throw new Error('Can not call update() on a finished decoder');
        }
        var out;
        _a = engines_1.partialThreeTwoDecode((typeof buffer === "string") ? Buffer.from(buffer) : buffer, this.alphabet, this.carry, this.carryLength, this.padding, false, false), out = _a[0], this.carry = _a[1], this.carryLength = _a[2], this.padding = _a[3];
        return out;
    };
    Decoder.prototype.finish = function () {
        this.finished = true;
        engines_1.partialThreeTwoDecode(null, this.alphabet, this.carry, this.carryLength, this.padding, true, this.options.checkPadding);
    };
    Decoder.prototype._transform = function (chunk, encoding, callback) {
        try {
            this.push(this.update(chunk));
            callback();
        }
        catch (e) {
            callback(e);
        }
    };
    Decoder.prototype._flush = function (callback) {
        try {
            this.finish();
            callback();
        }
        catch (e) {
            callback(e);
        }
    };
    return Decoder;
}(stream.Transform));
exports.Decoder = Decoder;
