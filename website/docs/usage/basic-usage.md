---
id: basic-usage
sidebar_position: 3
title: Basic Usage
sidebar_label: Basic Usage
description: Basic usage for react-native-global-exception-handler in React Native. Register JavaScript and native handlers, understand `forceAppToQuit` and `callPreviouslyDefinedHandler`, and move to release testing.
keywords:
  - react native global error handler example
  - react native exception handler usage
  - react native javascript crash handling
---

Basic usage covers the smallest setup that is still useful in a real app. Read this after installation if you want to register JavaScript and native handlers, understand the main native options, and get to a clean baseline before adding provider-specific integrations. It is also the quickest way to see what should be validated in release mode.

## Understand the two crash layers

### JavaScript exceptions

JavaScript exceptions come from your React or React Native code. These failures are usually easier to report and can still trigger controlled UI or logging flows before the app exits.

Common examples:

- undefined values
- logic bugs
- failed assumptions in app code

### Native exceptions

Native exceptions come from iOS or Android runtime code and are more restrictive.

Common examples:

- null pointer failures
- memory access violations
- platform-specific native crashes

> Native crash behavior is platform-dependent. Read [Native Crash Handling](./native-crash-handling.md) before building custom UI or restart flows around it.

## Register the JavaScript exception handler

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error.message, 'Fatal:', isFatal);
  // send to your reporting service
}, true);
```

### Parameters

- `customHandler`: receives `(error: Error, isFatal: boolean)`
- `allowedInDevMode`: set to `true` if you want the handler to run in development too

## Register the native exception handler

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  console.log('Native Exception:', errorString);
  // send to Sentry, Crashlytics, or your backend
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

### Options

- `forceAppToQuit`: Android-only behavior for terminating the app after the handler runs
- `callPreviouslyDefinedHandler`: chains the earlier native exception handler if needed

## Complete setup example

```ts
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Error:', error, isFatal);
}, true);

setNativeExceptionHandler((errorString) => {
  console.log('Native Error:', errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

## Development vs production

- JavaScript handling can run in development if you pass `true`.
- Native crash handling should be validated in release builds because debug tooling can interfere with the behavior.

Use [Troubleshooting](../troubleshooting.md) if the callbacks do not behave the way you expect.

## Where to go next

- [Native Crash Handling](./native-crash-handling.md) for platform limits and recovery expectations
- [React Native Sentry Integration](../examples/react-native-sentry-integration.md) for Sentry reporting
- [React Native Crashlytics Integration](../examples/react-native-crashlytics-integration.md) for Firebase
- [Migrating from react-native-exception-handler](../migration/migrating-from-react-native-exception-handler.md) if you are upgrading from the older package

## Next actions

- [Read the API Reference](../api.md)
