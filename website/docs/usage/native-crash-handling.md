---
id: native-crash-handling
sidebar_position: 4
title: Native Crash Handling
sidebar_label: Native Crashes
description: Handle native crashes in React Native with react-native-global-exception-handler. Learn Android and iOS limits, `callPreviouslyDefinedHandler`, and why native crash behavior should be tested in release mode.
keywords:
  - react native native crash handling
  - react native native exception handler
  - ios native crash handling react native
---

Native crash handling is the part of the library where platform limits matter most. This page is for cases where JavaScript handling is already clear, but you still need to understand Android versus iOS behavior, when to chain an existing native handler, and why release builds are the only meaningful test environment. The goal is to set realistic expectations before you rely on a native crash flow in production.

## Basic native crash setup

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  console.log('Native crash:', errorString);
  // forward to your monitoring service
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

## How the native handler works

- iOS installs native exception and signal handlers.
- Android installs an `UncaughtExceptionHandler`.
- Your callback runs very late in the failure path, so it must stay lightweight.
- `callPreviouslyDefinedHandler` lets you chain another native exception handler after your own callback has run.

## Android behavior

Android is the more flexible platform for native crash recovery:

- you can log crash information
- you can decide whether to force the app to quit
- some restart or relaunch flows are possible depending on your app design

```ts
setNativeExceptionHandler((errorString) => {
  console.log(errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

### Android options

- `forceAppToQuit: true` is the safer default for a clean post-crash state
- `forceAppToQuit: false` can make sense for advanced recovery flows or navigation-driven restart strategies
- `callPreviouslyDefinedHandler: true` is useful if another SDK or native layer already registered its own handler and you want to preserve that behavior

## iOS behavior

iOS is stricter after a native crash:

- interactive UI is not reliable
- programmatic restart is not supported
- the app is already in an unstable state
- touch handlers and button callbacks may stop working
- not every low-level signal crash can be recovered or even reported cleanly

That means your iOS handler should focus on lightweight logging or native crash-screen strategies that respect the platform constraints.

If you use a custom native popup flow on iOS, make sure the app is allowed to continue its crash path after you finish the minimal logging or display work. Holding the exception indefinitely can leave the app hung instead of terminated cleanly.

:::warning
Do not rely on interactive React Native UI after a fatal native iOS crash. Touch handlers and normal app flow are not dependable in that state.
:::

## Release-build testing matters

Native crash handling needs release-build verification because debug infrastructure can change the behavior you see in development.

Recommended validation flow:

1. Complete [Installation](../overview/installation.md)
2. Register handlers from [Basic Usage](./basic-usage.md)
3. Use [Simulate Native Crash in React Native](../examples/simulate-native-crash-in-react-native.md)
4. Confirm your reporting provider receives the payload

## Integrations

Need reporting examples?

- [React Native Sentry Integration](../examples/react-native-sentry-integration.md)
- [React Native Crashlytics Integration](../examples/react-native-crashlytics-integration.md)

## Minimal chained-handler example

```ts
setNativeExceptionHandler((errorString) => {
  console.log('Native error:', errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: true,
});
```

## Next actions

- [Read Troubleshooting](../troubleshooting.md)
- [See the full API Reference](../api.md)
