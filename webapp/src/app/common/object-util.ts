import deepEqual = require('deep-equal');


export function cloneObject(input: any): any {
  return JSON.parse(JSON.stringify(input));
}

export function freezeObject<T>(object: T): T {
  return <T>Object.freeze(object);
}

export function equalObjects(objectA: any, objectB: any): boolean {
  if (objectA === objectB) {
    return true;
  }
  return deepEqual(objectA, objectB);
}
