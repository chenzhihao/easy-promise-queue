import PromiseQueue from './PromiseQueue';

let pq = new PromiseQueue({concurrency: 1});

window.pq = pq;
let i = 0;

function PromiseThunk () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(`task ${i}`);
      console.log('size:' , pq.size);
      console.log('ongoing:' , pq.ongoing);
      resolve();
    }, 1000)
  });
}

pq.add([PromiseThunk, PromiseThunk, PromiseThunk]);

// pq.add(PromiseThunk).add(PromiseThunk).add(PromiseThunk);
for (let i = 3; i < 10; i++) {
  pq.add(() => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log(`task ${i}`);
        console.log('size:' , pq.size);
        console.log('ongoing:' , pq.ongoing);
        resolve();
      }, 1000)
    });
  });
}