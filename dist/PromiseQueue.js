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
    var PromiseQueue = /** @class */ (function () {
        function PromiseQueue(opts) {
            this._resolveEmpty = function () { return undefined; };
            this._queue = [];
            this._pause = false;
            opts = Object.assign({
                concurrency: 1,
            }, opts);
            if (opts.concurrency < 1) {
                throw new TypeError("Expected `concurrency` to be an integer which is bigger than 0");
            }
            this._ongoingCount = 0;
            this._concurrency = opts.concurrency;
        }
        PromiseQueue.prototype.pause = function () {
            this._pause = true;
        };
        PromiseQueue.prototype.resume = function () {
            this._pause = false;
            this._next();
        };
        PromiseQueue.prototype.add = function (fn) {
            var _this = this;
            if (Array.isArray(fn)) {
                if (fn.length > 1) {
                    var res = this.add(fn.shift());
                    if (!(res instanceof TypeError)) {
                        return this.add(fn);
                    }
                }
                return this.add(fn[0]);
            }
            else {
                // tslint:disable-next-line
                new Promise(function (resolve, reject) {
                    var run = function () {
                        _this._ongoingCount++;
                        fn().then(function (val) {
                            resolve(val);
                            _this._next();
                        }, function (err) {
                            reject(err);
                            _this._next();
                        });
                    };
                    if (_this._ongoingCount < _this._concurrency && !_this._pause) {
                        run();
                    }
                    else {
                        _this._queue.push(run);
                    }
                });
                return this;
            }
        };
        Object.defineProperty(PromiseQueue.prototype, "waitingCount", {
            // Promises which are not ready yet to run in the queue.
            get: function () {
                return this._queue.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PromiseQueue.prototype, "ongoingCount", {
            // Promises which are running but not done.
            get: function () {
                return this._ongoingCount;
            },
            enumerable: true,
            configurable: true
        });
        PromiseQueue.prototype._next = function () {
            if (this._pause) {
                return;
            }
            this._ongoingCount--;
            if (this._queue.length > 0) {
                var firstQueueTask = this._queue.shift();
                if (firstQueueTask) {
                    firstQueueTask();
                }
            }
            else {
                this._resolveEmpty();
            }
        };
        return PromiseQueue;
    }());
    exports.default = PromiseQueue;
});
//# sourceMappingURL=PromiseQueue.js.map