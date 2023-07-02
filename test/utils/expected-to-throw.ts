export class ExpectedToThrowError extends Error {
  constructor() {
    super('Expected to throw error on promise, but it didnt');
  }
}
