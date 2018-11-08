# easy-promise-queue

> Easy promise queue. Set a concurrency to execute promises in the queue.

[![NPM](https://nodei.co/npm/easy-promise-queue.png)](https://nodei.co/npm/easy-promise-queue/)

[![Build Status](https://travis-ci.org/chenzhihao/easy-promise-queue.svg)](https://travis-ci.org/chenzhihao/easy-promise-queue)

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

### How to import:

commonJS:

```javascript
require ('easy-promise-queue');
```

ES6:

```javascript
// ES6:
import PromiseQueue from 'easy-promise-queue';
```

Use it directly in browse:

```js
<script type="text/javascript" src="../dist/PromiseQueue.js"></script>
...
</script>
```
### Have a try:
[Jsbin Demo](https://jsbin.com/cuvuno/edit?html,js,console,output)

### How to use:
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
#### Adding a high-priority task to the queue:
```javascript
let pq = new PromiseQueue({concurrency: 1}); // any concurrency works
//
pq.add(promiseThunk);
pq.add(promiseThunk);
pq.prioritize(promiseThunk); // this promise will be processed ASAP/next in line
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
