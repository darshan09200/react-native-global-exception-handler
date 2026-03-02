---
id: getting-started
sidebar_position: 1
title: Getting Started
sidebar_label: Getting Started
description: Set up react-native-global-exception-handler in React Native. Install the library, register JavaScript and native handlers, and verify crash handling before moving to production.
keywords:
  - react native exception handler setup
  - react native crash handler getting started
  - javascript crash handling react native
---

Getting started should take you from a fresh install to the first working handler setup. If you are adding React Native exception handling for the first time, this is the right entry point before you layer on Sentry, Crashlytics, or custom recovery behavior. It also highlights the release-mode checks worth doing before you treat the setup as complete.

## What problem this solves

In React Native, uncaught failures do not all behave the same way:

- JavaScript exceptions can often be reported and surfaced before the app exits.
- Native crashes are more severe and follow platform-specific rules.
- Debug-mode behavior does not fully represent release-build behavior.

This package gives you one place to register handlers, send events to tools like Sentry or Crashlytics, and document what your app should do when a fatal error occurs.

## Install the package

If you have not installed the dependency yet:

```bash npm2yarn
npm install react-native-global-exception-handler
cd ios && pod install
```

For the full platform-specific checklist, use [Installation](./installation.md).

## Quick setup

Register the handlers as early as possible in your app entry point:

```ts
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error, isFatal);
  // forward to Sentry, Crashlytics, or your own backend
}, true);

setNativeExceptionHandler((errorString) => {
  console.log('Native Exception:', errorString);
  // forward to your monitoring service
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

## What you get after setup

- JavaScript exception handling through `setJSExceptionHandler`
- Native crash handling through `setNativeExceptionHandler`
- Built-in crash simulation utilities for QA
- TypeScript-friendly types for handler functions and options

## Recommended next steps

1. Read [Installation](./installation.md) for the platform checklist.
2. Move to [Basic Usage](../usage/basic-usage.md) for a more complete setup example.
3. Review [Native Crash Handling](../usage/native-crash-handling.md) before shipping release builds.
4. If you are replacing the older package, use the [Migration Guide](../migration/migrating-from-react-native-exception-handler.md).

## Want monitoring examples?

Use these guides when you are ready to wire reporting into your app:

- [React Native Sentry Integration](../examples/react-native-sentry-integration.md)
- [React Native Crashlytics Integration](../examples/react-native-crashlytics-integration.md)

## Next actions

- [Read the API Reference](../api.md)
