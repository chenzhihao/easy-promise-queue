export function isFunction (functionToCheck) {
  return functionToCheck && Object.prototype.toString.call(functionToCheck) === '[object Function]';
}

export function isArray (arrayToCheck) {
  return arrayToCheck && Object.prototype.toString.call(arrayToCheck) === '[object Array]';
}
