import PromiseQueue from './PromiseQueue';

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


for (let i = 3; i< 10; i++) {
  pq.add(() => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log(`task ${i}`);
        resolve();
      }, 1000)
    });
  });
}