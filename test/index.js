import PromiseQueue from '../src/PromiseQueue';
import assert from 'assert';

describe('When the concurrency limit is 1', function () {
  it('only execute one promise at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    promiseQueue.add(() => {
      return new Promise(resolve => {
        assert.equal(promiseQueue.ongoingCount, 1);
        setTimeout(function () {
          resolve(1);
        }, 500)
      })
    });

    promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.equal(promiseQueue.ongoingCount, 1);
        }, 500)
      })
    });

    promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.equal(promiseQueue.ongoingCount, 1);
          done();
        }, 500)
      })
    });

    // only one promise is waiting to run
    assert.equal(promiseQueue.waitingCount, 2);

    // only one promise is running
    assert.equal(promiseQueue.ongoingCount, 1);
  });
  describe('When an item is prioritized', function () {
    it('execute it ASAP', function (done) {
      const promiseQueue = new PromiseQueue({concurrency: 1});
      let results = []
      promiseQueue.add(() => {
        return new Promise(resolve => {
          setTimeout(function () {
            resolve(1);
            results.push(1)
            assert.equal(JSON.stringify(results), JSON.stringify([1]))
          }, 500)
        })
      });
  
      promiseQueue.add(() => {
        return new Promise(resolve => {
          setTimeout(function () {
            resolve(1);
            results.push(2)
            assert.equal(JSON.stringify(results), JSON.stringify([1,3,2]))
          }, 500)
        })
      });
  
      promiseQueue.prioritize((blah) => {
        return new Promise(resolve => {
          setTimeout(function () {
            resolve(10);
            results.push(3)
            assert.equal(JSON.stringify(results), JSON.stringify([1,3]))
            done();
          }, 500)
        })
      });
    });
  });
});

describe('When the concurrency limit is 2', function () {
  it('only execute not more than two promises at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.equal(promiseQueue.ongoingCount, 2);
        }, 500)
      })
    });

    promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.equal(promiseQueue.ongoingCount, 2);
        }, 500)
      })
    });

    promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.equal(promiseQueue.ongoingCount, 2);
        }, 500)
      })
    });

    promiseQueue.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.ok([1, 2].indexOf(promiseQueue.ongoingCount) > -1);
          done();
        }, 500)
      })
    });

    // only two promise is waiting to run
    assert.equal(promiseQueue.waitingCount, 2);

    // only two promises is running
    assert.equal(promiseQueue.ongoingCount, 2);
  });
  describe('When an item is prioritized', function () {
    it('execute it ASAP', function (done) {
      const promiseQueue = new PromiseQueue({concurrency: 2});
      let results = []
      for(let i = 1; i <= 10; i++) {
        promiseQueue.add(() => {
          return new Promise(resolve => {
            setTimeout(function () {
              resolve(i);
              results.push(i)
            }, 500)
          })
        });
      }
  
      promiseQueue.prioritize(() => {
        return new Promise(resolve => {
          setTimeout(function () {
            resolve(10);
            results.push(11)
            assert.equal(JSON.stringify(results), JSON.stringify([1,2,11]))
            done();
          }, 500)
        })
      });
    });
  });
});

describe('"Add" method can be chaining', function () {
  it('the return value is itself', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    let pqInstance = promiseQueue.add(() => {
      return new Promise(resolve => {
        assert.equal(promiseQueue.ongoingCount, 1);
        setTimeout(function () {
          resolve(1);
        }, 500)
      })
    });

    assert.ok(pqInstance instanceof PromiseQueue);

    pqInstance.add(() => {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(1);
          assert.equal(promiseQueue.ongoingCount, 1);
          done();
        }, 500)
      })
    });

    // only one promise is waiting to run
    assert.equal(promiseQueue.waitingCount, 1);

    // only one promise is running
    assert.equal(promiseQueue.ongoingCount, 1);
  });
});
