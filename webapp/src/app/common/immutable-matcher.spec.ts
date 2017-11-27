import {Iterable, List, Set} from 'immutable';
import {isPrimitive} from 'util';

export const immutableMatcher: jasmine.CustomMatcherFactories = {
  toBeImmutable: (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {
    return {
      compare: (actual: any, expected: any): jasmine.CustomMatcherResult => {
        const pass = Iterable.isIterable(actual);
        if (pass) {
          checkImmutable(actual);
          console.log(Object.keys(actual));
        }

        let message: string = null;
        if (!pass) {
          message = `Expected ${actual} to be immutable`;
        } else {
          message = `${actual} was immutable`;
        }
        return {
          pass: pass,
          message: message
        };
      }
    }
  }
};

function checkImmutable(value: any): boolean {
  if (isPrimitive(value)) {
    return true;
  }
  if (!Iterable.isIterable(value)) {
    console.log(`Not immutable: ${value}`);
    return false;
  }
  if (List.isList(value) || Set.isSet(value)) {
  }
}

