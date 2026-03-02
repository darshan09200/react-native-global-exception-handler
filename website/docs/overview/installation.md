---
id: installation
sidebar_position: 2
title: Installation
sidebar_label: Installation
seo_title: Install for React Native | react-native-global-exception-handler
description: Install react-native-global-exception-handler in React Native. Follow the iOS CocoaPods step, confirm Android native module linking, and check Troubleshooting if the module is not registered.
keywords:
  - install react-native-global-exception-handler
  - react native crash handler installation
  - ios pod install react native exception handler
  - android exception handler setup
---

Installation is the place to confirm that the package is present and the native module is actually available to the app. Work through this page if you need the iOS pod step, Android autolinking expectations, or the basic checks that catch an incomplete native setup early. Once this is done, you can move on to handler registration with confidence that the library is wired correctly.

## Requirements

- React Native 0.68 or later
- iOS or Android target app
- TypeScript only if you want typed handlers and option objects

## Architecture support

The package is designed to work with both React Native architecture modes:

- legacy architecture projects
- new architecture projects using TurboModules and Fabric

You do not need a separate install path for the new architecture in most setups. If you run into TurboModule registration issues after install, use the [Troubleshooting](../troubleshooting.md) steps to clear caches and rebuild the native app.

## Install the package

```bash npm2yarn
npm install react-native-global-exception-handler
```

## iOS setup

Run CocoaPods after installation:

```bash
cd ios && pod install
```

No additional manual iOS integration is required for the standard setup.

## Android setup

The Android native module auto-links in supported React Native versions. In most projects there are no extra manual Gradle steps beyond rebuilding the app.

If your app uses the new architecture and the native module is not registered, the usual fix is to clear Metro and native build caches, then rebuild from scratch. Those commands are listed in [Troubleshooting](../troubleshooting.md).

## TypeScript support

Types are bundled with the package:

```ts
import type {
  CrashType,
  ExceptionHandlerOptions,
  JSExceptionHandler,
  NativeExceptionHandler,
} from 'react-native-global-exception-handler';
```

## After installation

Once the package is installed:

1. Follow [Getting Started](./getting-started.md) to register the handlers.
2. Review [Basic Usage](../usage/basic-usage.md) for entry-point setup.
3. Read [Native Crash Handling](../usage/native-crash-handling.md) before testing release behavior.
4. Use [Troubleshooting](../troubleshooting.md) if pods, builds, or module registration fail.

## Need provider-specific examples?

- [React Native Sentry Integration](../examples/react-native-sentry-integration.md)
- [React Native Crashlytics Integration](../examples/react-native-crashlytics-integration.md)

## Next actions

- [Continue to Basic Usage](../usage/basic-usage.md)
