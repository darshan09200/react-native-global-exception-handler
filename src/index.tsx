import GlobalExceptionHandler from './NativeGlobalExceptionHandler';

export function multiply(a: number, b: number): number {
  return GlobalExceptionHandler.multiply(a, b);
}
