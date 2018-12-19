# easy-promise-queue

> 一个易用的promise队列

[![NPM](https://nodei.co/npm/easy-promise-queue.png)](https://nodei.co/npm/easy-promise-queue/)

[![Build Status](https://travis-ci.org/chenzhihao/easy-promise-queue.svg)](https://travis-ci.org/chenzhihao/easy-promise-queue)
[![Coverage Status](https://coveralls.io/repos/github/chenzhihao/easy-promise-queue/badge.svg?branch=master)](https://coveralls.io/github/chenzhihao/easy-promise-queue?branch=master)

中文 [English](https://github.com/chenzhihao/easy-promise-queue/blob/master/README.md)

## 它的使用场景

这是一个并发的promise队列，并且可以随时暂停

当并发数目被设置为1时（默认值），这就是一个先进先出（FIFO）队列

你可以把promises放到队列中。只有X个promise可以同时执行。

你可以在任何时候暂停/恢复队列。当队列被暂停的时候，已经开始执行的promise任然会继续完成执行。

## 安装
```bash
$ npm install easy-promise-queue
```

## 用法

### 如何引入

commonJS:

```javascript
const PromiseQueue = require("easy-promise-queue").default;
```

es2015:

```javascript
import PromiseQueue from 'easy-promise-queue';
```

浏览器中使用:

```js
<script type="text/javascript" src="../dist/PromiseQueue.js"></script>
...
</script>
```
### 试一试:
[Jsbin Demo](https://jsbin.com/cuvuno/edit?html,js,console,output)
```
### 如何使用:
#### Add Promise thunk to run promise one by one:
```js

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
#### 暂停队列:
```js
...
pq.pause();
// you can still add promise, however none of them will run.

pq.resume();
// Promises will resume to run.
```

## License
[MIT](https://tldrlegal.com/license/mit-license)
