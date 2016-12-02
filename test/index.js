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
  });
});


describe('1. when the concurrency limit is 2', function () {
  it('only execute one promise at one time', function (done) {
    const promiseQueue = new PromiseQueue({concurrency: 2});
    promiseQueue.add(()=>{return new Promise(resolve => {
      promiseQueue.pending.should.equal(1);
      setTimeout(function () {
        resolve(1);
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
  });
});


