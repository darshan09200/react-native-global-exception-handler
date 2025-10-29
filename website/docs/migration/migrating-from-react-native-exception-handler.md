---
id: migrating-from-react-native-exception-handler
title: Migrating from react-native-exception-handler
description: Guide to migrate from the original react-native-exception-handler to react-native-global-exception-handler, covering API changes and migration steps.
keywords:
  - migration
  - upgrade
  - react-native-exception-handler
  - breaking changes
---

This guide helps you migrate from the original `react-native-exception-handler` package to `react-native-global-exception-handler`.

## Overview

The newer library preserves the core concepts (global JS & native exception handling) while improving clarity, adding TypeScript types, and modernizing the native API.

## What Was Ported

The following concepts and behaviors remain the same, so existing mental models still apply:

- Global JavaScript exception handling via a single setup call (`setJSExceptionHandler`).
- Native exception interception concept (ability to run a handler just before process termination).
- Basic restart pattern for Android after fatal errors (using a restart utility or relaunch intent).
- Ability (conceptually) to chain/execute previously defined handlers.
- Force-quit semantics on Android after a native crash to ensure clean state.
- Distinction between JS exceptions and native exceptions, including limitations of UI interaction after native crashes.

## What's New

Enhancements and features introduced in `react-native-global-exception-handler`:

- Options object for native handler: `setNativeExceptionHandler(handler, { forceAppToQuit, callPreviouslyDefinedHandler })` replacing positional params.
- Full TypeScript surface: `ExceptionHandlerOptions`, handler function types, `CrashType` enum.
- Built-in native crash simulation via `simulateNativeCrash(crashType)` for QA/testing.

## Legacy Native API (Still Supported)

If you previously used the positional signature, it still works but is deprecated:

```ts
// Deprecated positional form
setNativeExceptionHandler(
  (errorString) => { console.log(errorString); },
  /* forceAppToQuit */ true,
  /* callPreviouslyDefinedHandler */ false
);

// Recommended object form
setNativeExceptionHandler((errorString) => {
  console.log(errorString);
}, { forceAppToQuit: true, callPreviouslyDefinedHandler: false });
```

## Why Migrate?

- Explicit defaults (`forceAppToQuit: true`, `callPreviouslyDefinedHandler: false`)
- Improved readability and future-proof extensibility via options object
- Full TypeScript support for safer integration
- Clear platform behavior (dev vs production; iOS vs Android constraints)
- API reference with all exported functions

## Migration Steps

1. Update dependency:

```bash npm2yarn
npm uninstall react-native-exception-handler
npm install react-native-global-exception-handler
cd ios && pod install
```

1. Update imports:

```ts
// Before
import { setJSExceptionHandler } from 'react-native-exception-handler';
// After
import { setJSExceptionHandler } from 'react-native-global-exception-handler';
```

1. Update native handler usage (if using legacy positional form):

```ts
// Before
setNativeExceptionHandler(handler, true, false);
// After
setNativeExceptionHandler(handler, { forceAppToQuit: true, callPreviouslyDefinedHandler: false });
```

1. Replace `executeDefaultHandler` naming with `callPreviouslyDefinedHandler`.
1. Add iOS crash flow if handling native exceptions: ensure you call `releaseExceptionHold()` in custom native popup logic.
1. Optional: Use `getJSExceptionHandler()` to chain existing handlers when integrating analytics SDKs.

## FAQ

### Do I need to change my existing JS exception handler?

No. The signature is identical. Only the preferred naming (`allowedInDevMode`) is documented consistently.

### Is the old native positional API removed?

No, it's still supported for backward compatibility, but new code should use the options object.

### How do I chain other SDK handlers?

Use:

```ts
const prev = getJSExceptionHandler();
setJSExceptionHandler((e, fatal) => {
  // custom logic
  if (prev) prev(e, fatal);
}, true);
```

For native handlers: `{ callPreviouslyDefinedHandler: true }`.

### When should I set `forceAppToQuit: false`?

Rare cases (navigation libraries or experimental recovery). Default `true` is safer.

## Cross-References

- [Usage Guide](../usage/usage.md)
- [API Reference](../api)
- [Native Crash Handling](../usage/native-crash-handling)
- [Troubleshooting](../troubleshooting)

## Credits

This library builds upon the excellent work done in the original project:

- Original repository: [react-native-exception-handler](https://github.com/a7ul/react-native-exception-handler)
- Maintained and evolved by its original authors and broader community of contributors.

Their collective contributions informed many design decisions here (global handler patterns, restart flows, native popup customization concepts). If you find value in this library, consider visiting the original repository and showing support.

## Next Steps

After migration, test:

1. JS handler triggers in dev (if enabled) and production.
2. Native handler triggers only in production.
3. Crash reporting integration still works (e.g., Sentry/Crashlytics).
4. Optional chaining logic preserves previous handlers.

If all pass, migration is complete.
