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
    class PromiseQueue {
        constructor(opts) {
            this._resolveEmpty = () => undefined;
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
        pause() {
            this._pause = true;
        }
        resume() {
            this._pause = false;
            this._next();
        }
        add(fn) {
            new Promise((resolve, reject) => {
                const run = () => {
                    this._ongoingCount++;
                    fn().then((val) => {
                        resolve(val);
                        this._next();
                    }, (err) => {
                        reject(err);
                        this._next();
                    });
                };
                if (this._ongoingCount < this._concurrency && !this._pause) {
                    run();
                }
                else {
                    this._queue.push(run);
                }
            });
            return this;
        }
        // Promises which are not ready yet to run in the queue.
        get waitingCount() {
            return this._queue.length;
        }
        // Promises which are running but not done.
        get ongoingCount() {
            return this._ongoingCount;
        }
        _next() {
            if (this._pause) {
                return;
            }
            this._ongoingCount--;
            if (this._queue.length > 0) {
                const firstQueueTask = this._queue.shift();
                if (firstQueueTask) {
                    firstQueueTask();
                }
            }
            else {
                this._resolveEmpty();
            }
        }
    }
    exports.default = PromiseQueue;
});
