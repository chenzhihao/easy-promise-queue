import chai from 'chai';
import PromiseQueue from '../src/PromiseQueue';
var assert = require('assert')
const should = chai.should();

describe('When the concurrency limit is 1', function () {
  it('only execute one promise at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    promiseQueue.add(()=>{return new Promise(resolve => {
      promiseQueue.ongoingCount.should.equal(1);
      setTimeout(function () {
        resolve(1);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.equal(1);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.equal(1);
        done();
      }, 500)
    })});

    // only one promise is waiting to run
    promiseQueue.waitingCount.should.equal(2);

    // only one promise is running
    promiseQueue.ongoingCount.should.equal(1);
  });
});

describe('When the concurrency limit is 2', function () {
  it('only execute not more than two promises at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.equal(2);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.equal(2);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.equal(2);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.be.within(1,2);
        done();
      }, 500)
    })});

    // only two promise is waiting to run
    promiseQueue.waitingCount.should.equal(2);

    // only two promises is running
    promiseQueue.ongoingCount.should.equal(2);
  });
});

describe('"Add" method can be chaining', function () {
  it('the return value is itself', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    let pqInstance = promiseQueue.add(()=>{return new Promise(resolve => {
      promiseQueue.ongoingCount.should.equal(1);
      setTimeout(function () {
        resolve(1);
      }, 500)
    })});

    let checkIfIsPromiseQueueInstance = pqInstance instanceof PromiseQueue;

    checkIfIsPromiseQueueInstance.should.be.true;

    pqInstance.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.ongoingCount.should.equal(1);
        done();
      }, 500)
    })});

    // only one promise is waiting to run
    promiseQueue.waitingCount.should.equal(1);

    // only one promise is running
    promiseQueue.ongoingCount.should.equal(1);
  });
});
