import assert from "assert";
import { PromiseQueue } from "../src/PromiseQueue";

describe("When the concurrency limit is 1", () => {
  it("only execute one promise at one time", (done) => {
    const promiseQueue = new PromiseQueue({ concurrency: 1 });
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 500);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 1);
        }, 500);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 1);
          done();
        }, 500);
      });
    });

    // only one promise is waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);

    // only one promise is running
    assert.strictEqual(promiseQueue.ongoingCount, 1);
  });
});

describe("When the concurrency limit is 2", () => {
  it("only execute not more than two promises at one time", (done) => {
    const promiseQueue = new PromiseQueue({ concurrency: 2 });
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 2);
        }, 500);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 2);
        }, 500);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 2);
        }, 500);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.ok([1, 2].indexOf(promiseQueue.ongoingCount) > -1);
          done();
        }, 500);
      });
    });

    // only two promise is waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);

    // only two promises is running
    assert.strictEqual(promiseQueue.ongoingCount, 2);
  });
});

describe("`add` method can be chaining", () => {
  it("the return value is itself", (done) => {
    const promiseQueue = new PromiseQueue({ concurrency: 1 });
    const pqInstance = promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 500);
      });
    });

    assert.ok(pqInstance instanceof PromiseQueue);

    if (!(pqInstance instanceof TypeError)) {
      pqInstance.add(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(1);
            assert.strictEqual(promiseQueue.ongoingCount, 1);
            done();
          }, 500);
        });
      });
    }

    // only one promise is waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 1);

    // only one promise is running
    assert.strictEqual(promiseQueue.ongoingCount, 1);
  });
});

describe("The parameter of `add` method can be Array", () => {
  it("the return value is itself", (done) => {
    const promiseQueue = new PromiseQueue({ concurrency: 1 });

    const promises = [() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          // only one promise is waiting to run
          assert.strictEqual(promiseQueue.waitingCount, 1);

          // only one promise is running
          assert.strictEqual(promiseQueue.ongoingCount, 1);
          resolve(1);
        }, 500);
      })
    }, () => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
          done();
        }, 500);
      });
    }];
    const pqInstance = promiseQueue.add(promises);
    assert.ok(pqInstance instanceof PromiseQueue);
  });
});
