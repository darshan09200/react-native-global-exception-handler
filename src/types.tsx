export type { ExceptionHandlerOptions } from './NativeGlobalExceptionHandler';

export const CrashType = {
  nsexception: 'nsexception' as const,
  array_bounds: 'array_bounds' as const,
  invalid_argument: 'invalid_argument' as const,
  memory_access: 'memory_access' as const,
  abort: 'abort' as const,
  stack_overflow: 'stack_overflow' as const,
  internal_inconsistency: 'internal_inconsistency' as const,
  malloc_error: 'malloc_error' as const,
  sigill: 'sigill' as const,
  sigbus: 'sigbus' as const,
};

export type CrashType = keyof typeof CrashType;

export interface ErrorUtilsType {
  setGlobalHandler: (handler: JSExceptionHandler) => void;
  getGlobalHandler: () => JSExceptionHandler | undefined;
  reportError: (error: any) => void;
}

export type JSExceptionHandler = (error: Error, isFatal: boolean) => void;
export type NativeExceptionHandler = (exceptionMsg: string) => void;
