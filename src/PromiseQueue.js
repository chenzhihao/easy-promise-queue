class PromiseQueue {
  constructor (opts) {
    this._queue = [];

    opts = Object.assign({
      concurrency: Infinity,
    }, opts);

    if (opts.concurrency < 1) {
      throw new TypeError('Expected `concurrency` to be a number from 1 and up');
    }

    this._pendingCount = 0;
    this._concurrency = opts.concurrency;
    this._resolveEmpty = () => {
    };
  }

  _next () {
    this._pendingCount--;

    if (this._queue.length > 0) {
      this._queue.shift()();
    } else {
      this._resolveEmpty();
    }
  }

  add (fn) {
    return new Promise((resolve, reject) => {
      const run = () => {
        this._pendingCount++;

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

      if (this._pendingCount < this._concurrency) {
        run();
      } else {
        this._queue.push(run);
      }
    });
  }

  // Promises which are not ready yet to run in the queue.
  get size () {
    return this._queue.length;
  }

  // Promises which are running but not done.
  get pending () {
    return this._pendingCount;
  }
}

export default PromiseQueue;