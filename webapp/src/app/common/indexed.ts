export class Indexed<T> {
  static indexArray<T>(input: T[], factory: (entry: any) => T, keyValue: (t: T) => string): Indexed<T> {
    if (!input) {
      return new Indexed<T>([], new Map<string, number>());
    }

    const array: T[] = new Array<T>(input.length);
    const indices: Map<string, number> = new Map<string, number>();

    let i = 0;
    for (const entry of input) {
      const value: T = factory(entry);
      const key: string = keyValue(value);
      array[i] = value;
      indices[key] = i;
      i++;
    }
  }

  constructor(private _array: T[], _indices: Map<string, number>) {
  }

}
