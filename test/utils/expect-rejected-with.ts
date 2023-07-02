import { isErrorType } from './is-error-type';
import { ExpectedToThrowError } from './expected-to-throw';

type Constructor<T extends Error> = new (...args: any[]) => T;

export async function expectRejectedWith<T extends Error>(
  promise: Promise<unknown>,
  errorType: Constructor<T>,
  validator?: (error: T) => void,
): Promise<void> {
  try {
    await promise;
    throw new ExpectedToThrowError();
  } catch (error) {
    if (isErrorType(error, ExpectedToThrowError)) {
      throw error;
    }

    expect(error).toBeInstanceOf(errorType);

    if (validator) {
      validator(error);
    }
  }
}
