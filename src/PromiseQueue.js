import * as utils from './typeCheck';

class PromiseQueue {
  constructor (opts) {
    this._queue = [];

    opts = Object.assign({
      concurrency: Infinity,
    }, opts);

    if (opts.concurrency < 1) {
      throw new TypeError('Expected `concurrency` to be a integer which is bigger than 0');
    }

    this._ongoingCount = 0;
    this._concurrency = opts.concurrency;
    this._resolveEmpty = () => {
    };
  }

  _next () {
    this._ongoingCount--;

    if (this._queue.length > 0) {
      this._queue.shift()();
    } else {
      this._resolveEmpty();
    }
  }

  add (fn) {
    if (utils.isArray(fn) && fn.every(utils.isFunction)) {
      return fn.length > 1 ? this.add(fn.shift()).add(fn) : this.add(fn[0]);
    } else if (utils.isFunction(fn)) {
      new Promise((resolve, reject) => {
        const run = () => {
          this._ongoingCount++;

          fn().then(
            val => {
              resolve(val);
              this._next();
            },
            err => {
              reject(err);
              this._next();
            }
          );
        };

        if (this._ongoingCount < this._concurrency) {
          run();
        } else {
          this._queue.push(run);
        }
      });
      return this;
    } else {
      throw new TypeError('Expected `arg` in add(arg) must be a function which return a Promise, or an array of function which return a Promise');
    }
  }

  // Promises which are not ready yet to run in the queue.
  get size () {
    return this._queue.length;
  }

  // Promises which are running but not done.
  get ongoing () {
    return this._ongoingCount;
  }
}

export default PromiseQueue;