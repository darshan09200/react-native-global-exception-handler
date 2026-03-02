---
id: api
sidebar_position: 5
title: API Reference
description: API reference for react-native-global-exception-handler. Review JavaScript and native handler signatures, default option values, and crash simulation utilities for React Native.
keywords:
  - react-native-global-exception-handler api
  - react native exception handler api
  - react native native exception handler options
  - simulate native crash api
---

The API reference is the place to confirm exact signatures, default values, and behavior details without reading the setup guides again. It is most useful once you already know the flow you want and need to check which function to call, how the options behave, or how crash simulation fits into testing. Keep this page nearby when you are wiring handlers or reviewing an existing implementation.

## JavaScript exception handlers

### `setJSExceptionHandler(customHandler, allowedInDevMode)`

Registers the global JavaScript exception handler.

Use this when you want to intercept uncaught JavaScript exceptions before the app exits or before you hand the error off to another reporting tool.

**Parameters**

- `customHandler`: [`JSExceptionHandler`](#jsexceptionhandler)
- `allowedInDevMode`: `boolean` and defaults to `false`

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error, isFatal);
}, true);
```

Common use cases:

- log the error to your backend
- show a crash dialog for fatal JavaScript exceptions
- chain another SDK handler after your own logic runs

### `getJSExceptionHandler()`

Returns the currently registered JavaScript exception handler.

This is mainly useful when you need to preserve an existing handler and chain your own logic before or after it runs.

**Returns:** [`JSExceptionHandler`](#jsexceptionhandler)

Example:

```ts
import {
  getJSExceptionHandler,
  setJSExceptionHandler,
} from 'react-native-global-exception-handler';

const previousHandler = getJSExceptionHandler();

setJSExceptionHandler((error, isFatal) => {
  console.log('My handler', error.message);
  if (previousHandler) {
    previousHandler(error, isFatal);
  }
}, true);
```

## Native exception handlers

### `setNativeExceptionHandler(customErrorHandler, options)`

Registers the native exception handler.

This callback is for native crash messages, not for rendering normal React UI. Keep the work minimal and prefer logging or forwarding to a monitoring provider.

**Parameters**

- `customErrorHandler`: [`NativeExceptionHandler`](#nativeexceptionhandler)
- `options`: [`ExceptionHandlerOptions`](#exceptionhandleroptions)

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  console.log('Native error:', errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

Common use cases:

- forward the crash string to Sentry or Crashlytics
- preserve an earlier native handler with `callPreviouslyDefinedHandler`
- allow a tested Android recovery flow with `forceAppToQuit: false`

### Deprecated positional signature

```ts
setNativeExceptionHandler(
  handler,
  forceApplicationToQuit,
  executeDefaultHandler
);
```

If you are upgrading older code, use [Migrate from react-native-exception-handler](./migration/migrating-from-react-native-exception-handler.md).

### `setHandlerForNativeException(callback, callPreviouslyDefinedHandler)`

Deprecated. Prefer `setNativeExceptionHandler`.

This older API exists for backward compatibility with older usage patterns.

## Testing utilities

### `simulateNativeCrash(crashType)`

Simulates a native crash for testing.

This is intended for QA and release validation. Do not expose it to users in production code paths.

```ts
import { CrashType, simulateNativeCrash } from 'react-native-global-exception-handler';

simulateNativeCrash(CrashType.nsexception);
```

Another example:

```ts
simulateNativeCrash(CrashType.array_bounds);
```

For a practical workflow, read [Simulate Native Crash in React Native](./examples/simulate-native-crash-in-react-native.md).

## Types

### `JSExceptionHandler`

```ts
type JSExceptionHandler = (error: Error, isFatal: boolean) => void;
```

### `NativeExceptionHandler`

```ts
type NativeExceptionHandler = (errorMessage: string) => void;
```

`errorMessage` is the crash string passed from the native layer. Treat it as a logging/reporting payload, not as a signal that the app is still in a healthy UI state.

### `ExceptionHandlerOptions`

```ts
interface ExceptionHandlerOptions {
  callPreviouslyDefinedHandler?: boolean;
  forceAppToQuit?: boolean;
}
```

`forceAppToQuit`:

- Android-focused option
- defaults to `true`

`callPreviouslyDefinedHandler`:

- available on iOS and Android
- defaults to `false`
- use it when another SDK or native layer already installed a handler you still want to run

Defaults:

```ts
{
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
}
```

Typical object forms:

```ts
// Safer default
{
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
}

// Preserve an earlier native handler
{
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: true,
}

// Advanced Android-only recovery attempt
{
  forceAppToQuit: false,
  callPreviouslyDefinedHandler: true,
}
```

### `CrashType`

```ts
enum CrashType {
  nsexception = 'nsexception',
  array_bounds = 'array_bounds',
  invalid_argument = 'invalid_argument',
  memory_access = 'memory_access',
  abort = 'abort',
  stack_overflow = 'stack_overflow',
  internal_inconsistency = 'internal_inconsistency',
  malloc_error = 'malloc_error',
  sigill = 'sigill',
  sigbus = 'sigbus',
}
```

## Related guides

- [Getting Started](./overview/getting-started.md)
- [Basic Usage](./usage/basic-usage.md)
- [Native Crash Handling](./usage/native-crash-handling.md)
- [Troubleshooting](./troubleshooting.md)
