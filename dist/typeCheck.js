(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isFunction(functionToCheck) {
        return functionToCheck && Object.prototype.toString.call(functionToCheck) === '[object Function]';
    }
    exports.isFunction = isFunction;
    function isArray(arrayToCheck) {
        return arrayToCheck && Object.prototype.toString.call(arrayToCheck) === '[object Array]';
    }
    exports.isArray = isArray;
});
