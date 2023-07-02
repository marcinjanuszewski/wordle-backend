export const isErrorType = <T extends Error>(
  err: unknown,
  ctor: { new (...args): T },
): err is T => {
  return err.constructor.name === ctor.name;
};
