import { TurboModuleRegistry, type TurboModule } from 'react-native';

export type ExceptionHandlerCallback = (errorMessage: string) => void;

export type ExceptionHandlerOptions = {
  /**
   * If true, the previously defined native exception handler will be called after the custom handler.
   *
   * @platform Android, iOS
   */
  callPreviouslyDefinedHandler?: boolean;

  /**
   * If true, the app will be forced to quit after the custom handler is called.
   *
   * @platform Android
   */
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
    options: ExceptionHandlerOptions,
    callback: ExceptionHandlerCallback
  ): void;

  simulateNativeCrash(crashType: CrashType): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('GlobalExceptionHandler');
