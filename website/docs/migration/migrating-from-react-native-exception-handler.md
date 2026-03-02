---
id: migrating-from-react-native-exception-handler
title: Migrate from react-native-exception-handler
sidebar_label: Migration Guide
seo_title: Migration from react-native-exception-handler | react-native-global-exception-handler
description: Upgrade from react-native-exception-handler to react-native-global-exception-handler. Update imports, native handler options, and release-build testing without changing your core JS error flow.
keywords:
  - migrate from react-native-exception-handler
  - react-native-exception-handler alternative
  - react-native-global-exception-handler migration
  - react native crash handler migration
---

If your app already uses `react-native-exception-handler`, this guide walks through the switch to `react-native-global-exception-handler` with minimal churn. The main changes are the package import, the native handler options shape, and the release-build checks around JavaScript and native crash flows. In most apps, the migration is small, but it is still worth verifying both debug and release behavior before shipping.

## Why move to react-native-global-exception-handler

- clearer native handler configuration through an options object
- first-class TypeScript support
- built-in `simulateNativeCrash` utility for QA and release verification
- updated docs for iOS, Android, and new architecture projects

If you want a high-level package comparison first, read [react-native-exception-handler vs react-native-global-exception-handler](./react-native-exception-handler-vs-react-native-global-exception-handler.md).

## What stays the same

- You still register a global JavaScript exception handler.
- You still register a native exception handler for crash reporting.
- Existing ideas like restart flows, chaining previous handlers, and analytics forwarding still apply.

## Main API difference

The largest migration change is the native handler signature.

```ts
// Older style
setNativeExceptionHandler(handler, true, false);

// Recommended current style
setNativeExceptionHandler(handler, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

## Migration steps

### 1. Replace the dependency

```bash npm2yarn
npm uninstall react-native-exception-handler
npm install react-native-global-exception-handler
cd ios && pod install
```

### 2. Update imports

```ts
// Before
import { setJSExceptionHandler } from 'react-native-exception-handler';

// After
import { setJSExceptionHandler } from 'react-native-global-exception-handler';
```

### 3. Move native handler booleans into the options object

```ts
// Before
setNativeExceptionHandler(handler, true, false);

// After
setNativeExceptionHandler(handler, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

If your old setup depended on chaining another native handler, keep that behavior explicitly:

```ts
setNativeExceptionHandler(handler, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: true,
});
```

### 4. Re-test release behavior

After the code change, validate:

1. JavaScript exception handling
2. native crash handling in release builds
3. analytics forwarding to Sentry or Crashlytics
4. any custom restart or recovery flow

Use [Simulate Native Crash in React Native](../examples/simulate-native-crash-in-react-native.md) for the native-crash part of that test.

## FAQ

### Do I need to rewrite my JavaScript exception handler?

No. The core JS handler pattern stays the same.

### Is the old positional native API removed?

No. It is still supported for backward compatibility, but new code should use the object form.

### What if I already chain another handler?

Use `callPreviouslyDefinedHandler: true` and review the full signature in the [API Reference](../api.md).

## Credits

This library builds on the ideas popularized by the original project:

- Original repository: [react-native-exception-handler](https://github.com/a7ul/react-native-exception-handler)
- Maintained and evolved by its original authors and wider community of contributors

The migration path exists because that earlier work made the JS/global-handler model familiar to many React Native teams.

## Next actions

- [Install the package](../overview/installation.md)
- [Read Basic Usage](../usage/basic-usage.md)
