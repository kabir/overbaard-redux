import {Buffer} from 'buffer';

// Copied from https://www.npmjs.com/package/object-sizeof since I could not get it to work with typescript
export class SizeUtil {
  public static sizeof(object: any) {
    return sizeof(object);
  }
}

function sizeof(object) {
  if (object !== null && typeof (object) === 'object') {
    if (Buffer.isBuffer(object)) {
      return object.length;
    } else {
      let bytes = 0;
      for (const key in object) {

        if (!Object.hasOwnProperty.call(object, key)) {
          continue;
        }

        bytes += sizeof(key);
        try {
          bytes += sizeof(object[key]);
        } catch (ex) {
          if (ex instanceof RangeError) {
            // circular reference detected, final result might be incorrect
            // let's be nice and not throw an exception
            bytes = 0;
          }
        }
      }
      return bytes;
    }
  } else if (typeof (object) === 'string') {
    return object.length * ECMA_SIZES.STRING;
  } else if (typeof (object) === 'boolean') {
    return ECMA_SIZES.BOOLEAN;
  } else if (typeof (object) === 'number') {
    return ECMA_SIZES.NUMBER;
  } else {
    return 0;
  }
}

/**
 * Byte sizes are taken from ECMAScript Language Specification
 * http://www.ecma-international.org/ecma-262/5.1/
 * http://bclary.com/2004/11/07/#a-4.3.16
 */

const ECMA_SIZES = {
  STRING: 2,
  BOOLEAN: 4,
  NUMBER: 8
};
