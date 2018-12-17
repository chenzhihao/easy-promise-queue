import * as utils from "./typeCheck";

interface IPromiseQueueOpts {
  concurrency: number;
}

class PromiseQueue {
  private _queue: Array<() => any>;
  private _pause: boolean;
  private _ongoingCount: number;
  private _concurrency: number;

  constructor(opts: IPromiseQueueOpts) {
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

  public pause() {
    this._pause = true;
  }

  public resume() {
    this._pause = false;
    this._next();
  }

  public add(fn: () => Promise<any> | Array<() => Promise<any>>): PromiseQueue | TypeError {
    if (utils.isArray(fn) && fn.every(utils.isFunction)) {
      return fn.length > 1 ? this.add(fn.shift()).add(fn) : this.add(fn[0]);
    } else if (utils.isFunction(fn)) {
      new Promise((resolve, reject) => {
        const run = () => {
          this._ongoingCount++;
          fn().then(
            (val: any) => {
              resolve(val);
              this._next();
            },
            (err: Error) => {
              reject(err);
              this._next();
            }
          );
        };

        if (this._ongoingCount < this._concurrency && !this._pause) {
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
  get waitingCount() {
    return this._queue.length;
  }

  // Promises which are running but not done.
  get ongoingCount() {
    return this._ongoingCount;
  }

  private _resolveEmpty: () => void = () => undefined;

  private _next() {
    if (this._pause) {
      return;
    }

    this._ongoingCount--;

    if (this._queue.length > 0) {
      const firstQueueTask = this._queue.shift();
      if (firstQueueTask) {
        firstQueueTask();
      }
    } else {
      this._resolveEmpty();
    }
  }
}

export default PromiseQueue;
