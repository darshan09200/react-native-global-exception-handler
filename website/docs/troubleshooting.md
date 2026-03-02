---
id: troubleshooting
sidebar_position: 12
title: Troubleshooting
description: Troubleshoot react-native-global-exception-handler in React Native. Fix module registration errors, pod install failures, debug-vs-release confusion, and native crashes not being captured.
keywords:
  - react native exception handler not working
  - react-native-global-exception-handler troubleshooting
  - turbomodule not found globalexceptionhandler
  - pod install global exception handler
---

When the module is not registered, pods fail, or native crashes are not being captured, start here. This page focuses on the checks that usually explain those problems, especially the difference between debug behavior and release behavior in React Native. It should help you narrow the issue before you open a bug report or start changing working code.

## Before you open an issue

- confirm the React Native version
- note the iOS and Android versions you tested
- state whether the problem happens in debug, release, or both
- include exact reproduction steps
- include logs, stack traces, or build errors

## Debug vs Release

JavaScript handlers can be tested in development if you enable them. Native crash behavior is a release-mode concern first, because debug tooling can intercept or change the failure path.

## Common issues

- module not registered or `TurboModuleRegistry.getEnforcing` errors
- `pod install` or native build failures
- JavaScript crashes captured but native crashes not captured
- native handler works in debug assumptions but fails in release validation
- another SDK handler no longer runs after registration

## Installation issues

### CocoaPods could not find the pod

```text
[!] CocoaPods could not find compatible versions for pod "GlobalExceptionHandler"
```

Try:

```bash
sudo gem install cocoapods
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

Then revisit [Installation](./overview/installation.md).

### Android build dependency failure

```text
Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'
```

Check your Kotlin version in `android/build.gradle`, then clean:

```gradle
buildscript {
    ext {
        kotlinVersion = "1.8.0"
    }
}
```

```bash
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..
```

### TurboModule is not registered

```text
TurboModuleRegistry.getEnforcing called for module 'GlobalExceptionHandler' but it is not registered
```

This usually points to a cache or build mismatch in a new architecture project.

```bash npm2yarn
npx react-native start --reset-cache
```

Then rebuild the native app from scratch:

```bash npm2yarn
# iOS
cd ios && rm -rf Pods && pod install && cd ..
npx react-native run-ios

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

If your project uses TurboModules, the cache reset and clean rebuild steps above are the first things to retry.

## Runtime issues

### JavaScript handler does not run in development

Pass `true` as the second argument:

```ts
setJSExceptionHandler((error, isFatal) => {
  console.log(error, isFatal);
}, true);
```

### Native handler seems broken in debug mode

Debug builds can interfere with native crash handling. Validate native crash behavior in release builds instead.

```bash npm2yarn
npx react-native run-android --variant=release
```

If you test only in debug mode, you can get false negatives for native crash handling.

### App does not restart after a crash

Android restart-oriented flows usually need `forceAppToQuit: true` for predictable cleanup:

```ts
setNativeExceptionHandler((errorString) => {
  console.log(errorString);
}, {
  forceAppToQuit: true,
});
```

On iOS, programmatic restart is not a supported recovery strategy.

### Another SDK handler stopped running

If an analytics SDK or native library already set a native exception handler, enable chaining:

```ts
setNativeExceptionHandler((errorString) => {
  console.log(errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: true,
});
```

If the older handler still does not run, verify which library initializes last.

### When should `forceAppToQuit` be false?

Only in advanced cases, such as:

- custom native recovery logic
- navigation-driven recovery flows
- carefully tested Android-specific restart patterns

See [Native Crash Handling](./usage/native-crash-handling.md) before changing the default.

## Testing issues

### `simulateNativeCrash` does nothing

Check these first:

1. You are on iOS or Android, not web.
2. You are using a supported crash type.
3. You are testing in an environment where native crashes can actually execute.

Use [Simulate Native Crash in React Native](./examples/simulate-native-crash-in-react-native.md) for the full validation flow.

Two common mistakes:

- calling it only in debug mode and expecting release behavior
- using a crash type that does not make sense for the current platform or test path

### Test crash code leaked into production

Guard crash triggers with `__DEV__`:

```ts
import { CrashType, simulateNativeCrash } from 'react-native-global-exception-handler';

if (__DEV__) {
  global.triggerNativeCrash = () => {
    simulateNativeCrash(CrashType.nsexception);
  };
}
```

## Analytics issues

### Errors are not reaching Sentry or Crashlytics

- verify the monitoring SDK is initialized first
- keep the exception handler lightweight
- validate both JavaScript and native paths separately

Minimal verification example:

```ts
setJSExceptionHandler((error, isFatal) => {
  console.log('JS handler fired', error.message, isFatal);
}, true);

setNativeExceptionHandler((errorString) => {
  console.log('Native handler fired', errorString);
}, {
  forceAppToQuit: true,
});
```

If the console logs never appear in the expected environment, fix that first before debugging the monitoring provider.

Use the provider guides:

- [React Native Sentry Integration](./examples/react-native-sentry-integration.md)
- [React Native Crashlytics Integration](./examples/react-native-crashlytics-integration.md)

## Next actions

- [Read the API Reference](./api.md)
