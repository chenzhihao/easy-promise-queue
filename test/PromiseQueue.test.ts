import assert from "assert";
import PromiseQueue from "../src/PromiseQueue";

describe("When the concurrency limit is 1", () => {
  it("only execute one promise at one time", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 1);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 1);
          done();
        }, 50);
      });
    });

    // Two promises are waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);

    // only one promise is running
    assert.strictEqual(promiseQueue.ongoingCount, 1);
  });

  it("queue can be paused", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 50);
      });
    });

    promiseQueue.pause();

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(3);
        }, 50);
      });
    });

    // One promise is running (right after it was added)
    assert.strictEqual(promiseQueue.ongoingCount, 1);

    // Two promises are waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);

    setTimeout(() => {
      // as after the first promise started to executed, we paused the queue, there should no promise be "ongoing"
      // the other two are waiting.
      assert.strictEqual(promiseQueue.ongoingCount, 0);
      assert.strictEqual(promiseQueue.waitingCount, 2);
      done();
    }, 100);
  });

  it("queue can be resumed after paused", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 50);
      });
    });

    promiseQueue.pause();

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(3);
        }, 50);
      });
    });

    // One promise is running (right after it was added)
    assert.strictEqual(promiseQueue.ongoingCount, 1);

    // Two promises are waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);

    promiseQueue.resume();
    setTimeout(() => {
      // after the promise queue resumed, all the promises were executed
      assert.strictEqual(promiseQueue.ongoingCount, 0);
      assert.strictEqual(promiseQueue.waitingCount, 0);
      done();
    }, 200);
  });
});

describe("When the concurrency limit is 2", () => {
  it("only execute not more than two promises at one time", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.strictEqual(promiseQueue.ongoingCount, 2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
          assert.strictEqual(promiseQueue.ongoingCount, 2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(3);
          assert.strictEqual(promiseQueue.ongoingCount, 2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
          assert.ok([1, 2].indexOf(promiseQueue.ongoingCount) > -1);
          done();
        }, 50);
      });
    });

    // Two promises are running as the maximum concurrency is 2
    assert.strictEqual(promiseQueue.ongoingCount, 2);

    // Two promises are waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);
  });
  it("can be paused, before all the promise start to be executed in concurrency mode", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 50);
      });
    });

    promiseQueue.pause();

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(3);
        }, 50);
      });
    });

    // two promises are waiting to run, as we paused the queue before we add the second promise into it.
    assert.strictEqual(promiseQueue.waitingCount, 2);

    // only one promise is running
    assert.strictEqual(promiseQueue.ongoingCount, 1);

    setTimeout(() => {
      assert.strictEqual(promiseQueue.ongoingCount, 0);
      assert.strictEqual(promiseQueue.waitingCount, 2);
      done();
    }, 100);
  });

  it("can be paused, after promise start to be executed with maximum concurrency", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 50);
      });
    });

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(3);
        }, 50);
      });
    });

    promiseQueue.pause();

    promiseQueue.add(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(4);
        }, 50);
      });
    });

    // Two promises are waiting to run
    assert.strictEqual(promiseQueue.waitingCount, 2);

    // Two promise is running
    assert.strictEqual(promiseQueue.ongoingCount, 2);

    setTimeout(() => {
      // Even the third promise was added before pause, but it didn't get the chance
      // to be executed(the other two promises were running).
      // When it got its turn to be executed, the queue was already paused.
      assert.strictEqual(promiseQueue.ongoingCount, 0);
      assert.strictEqual(promiseQueue.waitingCount, 2);
      done();
    }, 200);
  });
});

describe("`add` method can be chaining", () => {
  it("the return value is itself", (done) => {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    const pqInstance = promiseQueue.add(() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
        }, 50);
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
          }, 50);
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
    const promiseQueue = new PromiseQueue({concurrency: 1});

    const promises = [() => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          // only one promise is waiting to run
          assert.strictEqual(promiseQueue.waitingCount, 1);

          // only one promise is running
          assert.strictEqual(promiseQueue.ongoingCount, 1);
          resolve(1);
        }, 50);
      });
    }, () => {
      return new Promise((resolve) => {
        assert.strictEqual(promiseQueue.ongoingCount, 1);
        setTimeout(() => {
          resolve(1);
          done();
        }, 50);
      });
    }];
    const pqInstance = promiseQueue.add(promises);
    assert.ok(pqInstance instanceof PromiseQueue);
  });
});
