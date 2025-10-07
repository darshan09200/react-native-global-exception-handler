import { TurboModuleRegistry, type TurboModule } from 'react-native';

export type ExceptionHandlerCallback = (errorMessage: string) => void;

export type ExceptionHandlerOptions = {
  // iOS-specific option
  callPreviouslyDefinedHandler?: boolean;
  // Android-specific option
  forceAppToQuit?: boolean;
};

export type CrashType =
  | 'nsexception'
  | 'array_bounds'
  | 'invalid_argument'
  | 'memory_access'
  | 'abort'
  | 'stack_overflow'
  | 'internal_inconsistency'
  | 'malloc_error'
  | 'sigill'
  | 'sigbus';

export interface Spec extends TurboModule {
  setHandlerForNativeException(
    callback: ExceptionHandlerCallback,
    options?: ExceptionHandlerOptions
  ): void;

  simulateNativeCrash(crashType: CrashType): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('GlobalExceptionHandler');
