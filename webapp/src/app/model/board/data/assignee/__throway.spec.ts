import {is, Iterable, List} from 'immutable';

describe('__Delete me', () => {
  it ('simple', () => {
    const list1: List<string> = List<string>(['a']);

    const list2: List<string> = list1.asMutable();
    list2.push('b');

    const list3: List<string> = list2.asImmutable();

    immutable(list1);
    immutable(list2);
    immutable(list3);
  });

  function immutable<T>(list: List<T>) {
    console.log(`Checking ${list.toString()}`);
    console.log(`Iterable: ${Iterable.isIterable(list)}`);
    console.log(`List: ${List.isList(list)}`);
    const imm: List<T> = list.asImmutable();
    // This should return false for list2 (in the caller) but it does not?
    console.log(`Immutable: ${imm === list}`);
    console.log(`Immutable: ${is(imm, list)}`);
  }

});
