import { Platform } from 'react-native';

import GlobalExceptionHandler, {
  type ExceptionHandlerOptions,
} from './NativeGlobalExceptionHandler';
import {
  CrashType,
  type ErrorUtilsType,
  type JSExceptionHandler,
  type NativeExceptionHandler,
} from './types';

function noop() {}

declare const ErrorUtils: ErrorUtilsType;

export function setJSExceptionHandler(
  customHandler: JSExceptionHandler = noop,
  allowedInDevMode = false
) {
  if (
    typeof allowedInDevMode !== 'boolean' ||
    typeof customHandler !== 'function'
  ) {
    console.log(
      'setJSExceptionHandler called with wrong argument types. First arg must be a function; second (optional) a boolean.'
    );
    return;
  }

  const allowed = allowedInDevMode ? true : !__DEV__;
  if (allowed) {
    ErrorUtils.setGlobalHandler(customHandler);
    const consoleError = console.error;
    console.error = (...args: any[]) => {
      if (args.length > 0) {
        ErrorUtils.reportError(args[0]);
      }
      consoleError(...args);
    };
  } else {
    console.log(
      'Skipping setJSExceptionHandler: In DEV and allowedInDevMode = false'
    );
  }
}

export function getJSExceptionHandler() {
  return ErrorUtils.getGlobalHandler();
}

/**
 * Sets a handler for native exceptions with platform-specific options.
 *
 * @example
 * // New preferred way - using options object
 * setNativeExceptionHandler((error) => {
 *   console.log('Native error:', error);
 * }, {
 *   forceAppToQuit: true,        // Android: force app to quit
 *   callPreviouslyDefinedHandler: false  // iOS: call previous handler
 * });
 *
 * @example
 * // Simple usage with defaults
 * setNativeExceptionHandler((error) => {
 *   console.log('Native error:', error);
 * });
 */
export async function setNativeExceptionHandler(
  customErrorHandler: NativeExceptionHandler,
  options?: ExceptionHandlerOptions
): Promise<void>;

/**
 * @deprecated Use the new signature with options object instead
 * @example
 * // Old way (still works but deprecated)
 * setNativeExceptionHandler(handler, true, false);
 */
export async function setNativeExceptionHandler(
  customErrorHandler: NativeExceptionHandler,
  forceApplicationToQuit?: boolean,
  executeDefaultHandler?: boolean
): Promise<void>;

// Implementation
export async function setNativeExceptionHandler(
  customErrorHandler: NativeExceptionHandler = noop,
  optionsOrForceQuit?: ExceptionHandlerOptions | boolean,
  executeDefaultHandler?: boolean
): Promise<void> {
  if (typeof customErrorHandler !== 'function') {
    console.log(
      'setNativeExceptionHandler is called with wrong argument types.. first argument should be callback function'
    );
    console.log(
      'Not setting the native handler .. please fix setNativeExceptionHandler call'
    );
    return;
  }

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    let options: ExceptionHandlerOptions = {};

    // Handle legacy API (second param is boolean)
    if (typeof optionsOrForceQuit === 'boolean') {
      const forceApplicationToQuit = optionsOrForceQuit;
      options = {
        forceAppToQuit: forceApplicationToQuit,
        callPreviouslyDefinedHandler: executeDefaultHandler || false,
      };
    }
    // Handle new API (second param is options object)
    else if (optionsOrForceQuit && typeof optionsOrForceQuit === 'object') {
      options = optionsOrForceQuit;
    }

    GlobalExceptionHandler.setHandlerForNativeException(
      customErrorHandler,
      options
    );
  } else {
    console.log('setNativeExceptionHandler is not supported on this platform.');
  }
}

/**
 * @deprecated Use setNativeExceptionHandler instead
 */
export function setHandlerForNativeException(
  callback: NativeExceptionHandler,
  callPreviouslyDefinedHandler: boolean = false
): void {
  const options: ExceptionHandlerOptions = {
    callPreviouslyDefinedHandler,
  };
  GlobalExceptionHandler.setHandlerForNativeException(callback, options);
}

export function simulateNativeCrash(
  crashType: CrashType = CrashType.nsexception
): void {
  console.log('simulating crash', crashType);
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    GlobalExceptionHandler.simulateNativeCrash(crashType);
    console.log('simulated crash', crashType);
  } else {
    console.log('simulateNativeCrash is not supported on this platform.');
  }
}

export * from './types';

export default {
  setJSExceptionHandler,
  getJSExceptionHandler,
  setNativeExceptionHandler,
  setHandlerForNativeException,
  simulateNativeCrash,
};
