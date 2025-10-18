---
id: native-crash-handling
sidebar_position: 4
title: Native Crash Handling
---

The library provides native exception handling for iOS and Android to catch crashes that occur in native code.

## How It Works

The library uses platform-specific native exception handlers:

- **iOS**: Installs an NSException handler and signal handlers
- **Android**: Installs an UncaughtExceptionHandler

When a native crash occurs, your handler function is called with the error message before the app terminates (or continues based on your options).

## Basic Usage

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  // errorString contains the native error message/stack
  console.log('Native crash:', errorString);
  
  // Send to error monitoring
  reportToSentry(errorString);
});
```

## Platform-Specific Options

### Android Options

```ts
setNativeExceptionHandler((errorString) => {
  // Handle error
}, {
  forceAppToQuit: true,  // Force app to terminate after handler runs
  callPreviouslyDefinedHandler: false  // Call previous handler
});
```

- `forceAppToQuit`: If `true` (default), forces the app to quit after your handler runs (Android only)
- `callPreviouslyDefinedHandler`: If `true`, calls any previously defined native handler (default: `false`)

### iOS Options

```ts
setNativeExceptionHandler((errorString) => {
  // Handle error
}, {
  callPreviouslyDefinedHandler: false  // Chain with previous handler
});
```

- `callPreviouslyDefinedHandler`: If `true`, calls any previously defined native exception handler (default: `false`)

## Platform Limitations

### iOS Limitations

iOS has stricter limitations when handling native crashes:

- **Cannot Restart Programmatically**: Unlike Android, iOS doesn't allow programmatic app restarts
- **UI State is Unstable**: The app is in an unstable state after a crash. UI may not render properly
- **Event Handlers Don't Work**: Click handlers and other event listeners won't fire in the error screen
- **Must Call `releaseExceptionHold()`**: You MUST call this to allow the app to crash gracefully. Without it, the app will hang indefinitely

**iOS Example:**

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  // Log the error
  console.log('iOS Native Crash:', errorString);
  
  // Report to analytics
});
```

:::warning
On iOS, **DO NOT** attempt to show interactive UI (buttons, touchable elements) in your error handler. The app is in an unstable state and touch events will not work.
:::

### Android Capabilities

Android is more flexible with native crash handling:

- Can restart the app programmatically
- UI can be displayed (though still unstable)
- Can force app to quit or continue running

### General Limitations

- Not all crashes can be intercepted (e.g., some signal-based crashes)
- Handler runs synchronously before crash, so keep it lightweight
- Network calls may not complete before app terminates
