---
id: usage
sidebar_position: 3
title: Usage
slug: /usage/usage
description: Detailed usage guide explaining JavaScript vs native exceptions and how to configure handlers and options for both platforms.
keywords:
  - usage
  - javascript
  - native
  - exception
  - handling
---

## Understanding Error Types

Before diving into usage, it's important to understand the two types of errors in a React Native app:

### JavaScript Exceptions

- Errors produced by your JavaScript/React code
- Can show UI dialogs, alerts, and perform async operations
- Can capture and handle gracefully before app crashes
- Examples: undefined variables, network errors, logic errors

### Native Exceptions

- Errors produced by native modules (iOS/Android)
- **Cannot** show JS alerts or update UI via JS code
- Must use native UI for error screens
- **Much more critical** - leave app in unstable state
- Examples: null pointer exceptions, memory access violations

> **Important**: Native exceptions are handled via native code. You cannot show React components or JS alerts when a native crash occurs. The handler runs just before the app terminates.

## JavaScript Exception Handling

Set up a global handler for JavaScript exceptions in your app's entry point (`index.js` or `App.tsx`):

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  // Send to error monitoring service (e.g., Sentry, Bugsnag)
  console.log('JS Exception:', error.message, 'Fatal:', isFatal);
  
  if (isFatal) {
    // Show crash screen or force restart
  }
}, true); // true = enable in dev mode
```

**Parameters:**

- First parameter: Handler function receiving `(error: Error, isFatal: boolean)`
- Second parameter: `allowedInDevMode` - Set to `true` to enable in development (default: `false`)

## Native Exception Handling

Handle native crashes on iOS and Android:

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  // errorString contains the native error message
  console.log('Native Exception:', errorString);
  
  // Send to error monitoring
}, {
  forceAppToQuit: true,  // Android: Force app to quit after handling
  callPreviouslyDefinedHandler: false  // Call previous handler (iOS/Android)
});
```

**Options:**

- `forceAppToQuit` (Android only): Force app to quit after handler runs
- `callPreviouslyDefinedHandler`: Chain with previous native exception handler

> Note: The native exception handler only activates in production (bundled) builds. In development you'll still see the Red Screen.

## Complete Setup Example

In your `index.js`:

```ts
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler 
} from 'react-native-global-exception-handler';

// JavaScript exception handler
setJSExceptionHandler((error, isFatal) => {
  // Send to monitoring service
  console.log('JS Error:', error, isFatal);
}, true);

// Native exception handler
setNativeExceptionHandler((errorString) => {
  // Send to monitoring service
  console.log('Native Error:', errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
});

```

## Development vs Production

By default, JS exception handler only works in production builds. Enable in development:

```ts
// Only in production (default)
setJSExceptionHandler(handler);

// Also in development
setJSExceptionHandler(handler, true);

// Or check manually
const isDev = __DEV__;
setJSExceptionHandler(handler, !isDev); // Only in production
```

## Getting the Current Handler

Retrieve the currently set JavaScript exception handler:

```ts
import { getJSExceptionHandler } from 'react-native-global-exception-handler';

const currentHandler = getJSExceptionHandler();
```

## Migration Guide

If you're upgrading from the original `react-native-exception-handler`, see the dedicated [Migration Guide](../migration/migrating-from-react-native-exception-handler.md) for differences, legacy API notes, and step-by-step update instructions.
