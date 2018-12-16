export function isFunction(functionToCheck: any) {
  return functionToCheck && Object.prototype.toString.call(functionToCheck) === '[object Function]';
}

export function isArray(arrayToCheck: any) {
  return arrayToCheck && Object.prototype.toString.call(arrayToCheck) === '[object Array]';
}
