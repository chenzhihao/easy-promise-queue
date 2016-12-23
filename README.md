# easy-promise-queue

[![NPM](https://nodei.co/npm/easy-promise-queue.png)](https://nodei.co/npm/easy-promise-queue/)
> Easy promise queue. Set a concurrency to execute promises in the queue.

[![Build Status](https://travis-ci.org/chenzhihao/easy-promise-queue.svg)](https://travis-ci.org/chenzhihao/easy-promise-queue)

## Installation
```bash
$ npm install easy-promise-queue
```

## Usage

### How to import:

commonJS:

```js
require ('easy-promise-queue');
```

ES6:

```js
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
```
git clone git@github.com:chenzhihao/easy-promise-queue.git

npm i

npm run dev

// Then open http://localhost:8080
```

### How to use:
####
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

## License
[MIT](https://tldrlegal.com/license/mit-license)