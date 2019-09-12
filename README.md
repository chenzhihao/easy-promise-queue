# easy-promise-queue

> Easy promise queue. Set a concurrency to execute promises in the queue.

[![NPM](https://nodei.co/npm/easy-promise-queue.png)](https://nodei.co/npm/easy-promise-queue/)

[![Build Status](https://travis-ci.org/chenzhihao/easy-promise-queue.svg?branch=master)](https://travis-ci.org/chenzhihao/easy-promise-queue)
[![codecov](https://codecov.io/gh/chenzhihao/easy-promise-queue/branch/master/graph/badge.svg)](https://codecov.io/gh/chenzhihao/easy-promise-queue)

English [中文](https://github.com/chenzhihao/easy-promise-queue/blob/master/README_CN.md)

## What is it used for

It's a concurrent queue which can pause.

When its concurrency is set as 1(by default), it's a FIFO queue.

You can put Promises into this queue. Only *X* promises can be executed concurrently as your configuration.

You can pause/resume this queue at any time. When the queue is paused, ongoing promises will keep running until done though.

## Installation
```bash
$ npm install easy-promise-queue
```

## Usage

### How to import

commonJS:

```javascript
const PromiseQueue = require("easy-promise-queue").default;
```

es2015:

```javascript
import PromiseQueue from 'easy-promise-queue';
```

### How to use
#### Add Promise thunk to run promise one by one:

```javascript
let pq = new PromiseQueue({concurrency: 1});

pq.add(() => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('task 1');
      resolve();
    }, 1000)
  });
});

pq.add(() => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('task 2');
      resolve();
    }, 1000)
  });
});

// syntax sugar:
pq.add([promiseThunk, promiseThunk, promiseThunk]);
// is equal to:
pq.add(promiseThunk).add(promiseThunk).add(promiseThunk);
// is equal to:
pq.add(promiseThunk);
pq.add(promiseThunk);
pq.add(promiseThunk);

//The added promises will be executed one by one.
```
#### How to pause the queue:
```javascript
...
pq.pause();
// you can still add promise, however none of them will run.

pq.resume();
// Promises will resume to run.
```

## License
[MIT](https://tldrlegal.com/license/mit-license)
