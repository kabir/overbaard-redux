import {SizeUtil} from './sizeof';
import {List, Map, OrderedMap, OrderedSet, Set} from 'immutable';

describe('Size Investigations', () => {
  it ('Some sizes', () => {
    checkSize('a', `'a'`);
    checkSize('abcd', `'abcd'`);
    checkSize('Someone needs to implement and test Issue Number 2', `'Someone needs to implement and test Issue Number 2`)
    checkSize(1, `number`);

    checkArray([])
    checkArray([1])
    checkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    checkArray(['a']);
    checkArray(['']);
    checkArray(['abcd']);
    checkArray(['a', 'b', 'c', 'd', 'e']);
    checkArray(['abcd', 'bcde', 'cdef', 'defg', 'efgh']);

    checkObject({});
    checkObject({
      a: 1
    });
    checkObject({
      test123: 1
    });
    checkObject({
      a: 'abcd'
    });
    checkObject({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5
    });

  });

  describe('Freeze', () => {
    it ('Object', () => {
      const o: Person = {
        name: 'Kabir',
        age: 30,
        interests: <string[]>Object.freeze(['Bowling'])
      }

      o.age = 45;
      // Won't work as the array is frozen
      // o.interests.push('Dancing');
      Object.freeze(o);
      // o['age'] = 45;
      // o.interests.push('Dancing');
      const newObj: Person = {
        ...o,
        age: 45,
        interests: <string[]>Object.freeze([...o.interests, 'Dancing'])
      };
      // Any changes here will not work either
    });
  });

  interface Person {
    name: string,
    age: number,
    interests: string[]
  }

  function checkArray(array: any[], printable?: string) {
    console.log('-----');
    if (!printable) {
      printable = array.toString();
    }
    checkSize(array, `[${printable}]`)
    checkSize(List<any>(array), `List<[${printable}]>`);
    checkSize(Set<any>(array), `Set<[${printable}]>`);
    checkSize(OrderedSet<any>(array), `OrderedSet<[${printable}]>`);
  }

  function checkObject(obj: any) {
    console.log('-----');
    const str = JSON.stringify(obj);
    checkSize(obj, `${str}`);
    checkSize(Map<any, any>(obj), `Map(${str})`);
    checkSize(OrderedMap<any, any>(obj), `OrderedMap(${str})`);
  }

  function checkSize(o: any, printable?: string) {
    console.log('Size: ' + SizeUtil.sizeof(o) + '; ' + (printable ? printable : o));
  }
});
