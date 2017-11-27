declare module jasmine {
  interface Matchers<T> {
    toBeImmutable(): boolean;
  }
}
