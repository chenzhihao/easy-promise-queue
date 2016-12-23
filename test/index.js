import chai from 'chai';
import PromiseQueue from '../src/PromiseQueue';

const should = chai.should();

describe('1. when the concurrency limit is 1', function () {
  it('only execute one promise at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 1});
    promiseQueue.add(()=>{return new Promise(resolve => {
      promiseQueue.pending.should.equal(1);
      setTimeout(function () {
        resolve(1);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.pending.should.equal(1);
        done();
      }, 500)
    })});

    // only one promise is waiting to run
    promiseQueue.size.should.equal(1);

    // only one promise is running
    promiseQueue.pending.should.equal(1);
  });
});


describe('1. when the concurrency limit is 2', function () {
  it('only execute two promises at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(()=>{return new Promise(resolve => {
      promiseQueue.pending.should.equal(1);
      promiseQueue.size.should.equal(1);
      setTimeout(function () {
        resolve(1);
        promiseQueue.size.should.equal(0);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.pending.should.equal(2);
      }, 500)
    })});

    promiseQueue.add(()=>{return new Promise(resolve => {
      setTimeout(function () {
        resolve(1);
        promiseQueue.pending.should.be.within(1,2);
        done();
      }, 500)
    })});

    // only one promise is waiting to run
    promiseQueue.size.should.equal(1);

    // only two promises is running
    promiseQueue.pending.should.equal(2);
  });
});


