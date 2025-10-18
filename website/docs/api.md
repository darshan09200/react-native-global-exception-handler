---
id: api
sidebar_position: 5
title: API Reference
---

## JavaScript Exception Handlers

### `setJSExceptionHandler(customHandler, allowedInDevMode)`

Sets a global handler for JavaScript exceptions.

**Parameters:**

- `customHandler`: [`JSExceptionHandler`](#jsexceptionhandler) - Function called when a JS exception occurs
- `allowedInDevMode: boolean` - If `true`, handler works in development mode (default: `false`)

**Example:**

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error, isFatal);
  // Send to error reporting service
}, true); // Enable in dev mode
```

### `getJSExceptionHandler()`

Returns the currently set global JavaScript exception handler.

**Returns:** [`JSExceptionHandler`](#jsexceptionhandler)

## Native Exception Handlers

### `setNativeExceptionHandler(customErrorHandler, options)`

Sets a handler for native exceptions with platform-specific options.

**Parameters:**

- `customErrorHandler`: [`NativeExceptionHandler`](#nativeexceptionhandler) - Function called when a native exception occurs
- `options`: [`ExceptionHandlerOptions`](#exceptionhandleroptions) (optional) - Platform-specific configuration. If omitted, defaults are used (see [`ExceptionHandlerOptions`](#exceptionhandleroptions)).

**Example (New API):**

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

await setNativeExceptionHandler((errorString) => {
  console.log('Native error:', errorString);
  // Send to error reporting service
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
});
```

**Legacy API (Deprecated):**

```ts
// Old signature still works but is deprecated
await setNativeExceptionHandler(
  handler,
  forceApplicationToQuit,  // boolean
  executeDefaultHandler    // boolean
);
```

### `setHandlerForNativeException(callback, callPreviouslyDefinedHandler)` ⚠️ Deprecated

**Deprecated:** Use `setNativeExceptionHandler` instead.

## Testing & Utilities

### `simulateNativeCrash(crashType)`

Simulates a native crash for testing purposes. **Use with caution** - will crash your app!

**Parameters:**

- `crashType`: [`CrashType`](#crashtype) - Type of crash to simulate (default: `'nsexception'`)

**Available Crash Types:** See [`CrashType`](#crashtype)

**Example:**

```ts
import { simulateNativeCrash, CrashType } from 'react-native-global-exception-handler';

// Simulate crash
simulateNativeCrash(CrashType.nsexception);
```

## Types

### `JSExceptionHandler`

```ts
type JSExceptionHandler = (error: Error, isFatal: boolean) => void;
```

### `NativeExceptionHandler`

```ts
type NativeExceptionHandler = (errorMessage: string) => void;
```

### `ExceptionHandlerOptions`

The `options` object allows you to control native crash handling behavior:

- `forceAppToQuit` (`boolean`, Android only, default: `true`):
  - If `true`, the app will be force-closed after your handler runs. Useful for ensuring a clean state after a fatal native crash.
  - If `false` (default), the app will attempt to continue running after the handler.
- `callPreviouslyDefinedHandler` (`boolean`, iOS & Android, default: `false`):
  - If `true`, any previously registered native exception handler will be called after your handler.
  - If `false` (default), only your handler is called.

**Default values:**

If you omit the `options` parameter, the defaults are:

```ts
{
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
}
```

```ts
interface ExceptionHandlerOptions {
  callPreviouslyDefinedHandler?: boolean;
  forceAppToQuit?: boolean;
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

## Default Export

The library also exports a default object with all functions:

```ts
import GlobalExceptionHandler from 'react-native-global-exception-handler';

GlobalExceptionHandler.setJSExceptionHandler(/* ... */);
GlobalExceptionHandler.setNativeExceptionHandler(/* ... */);
GlobalExceptionHandler.simulateNativeCrash(/* ... */);
```
