---
id: simulate-native-crash-in-react-native
title: Crash Simulation
sidebar_label: Crash Simulation
sidebar_position: 5
description: Learn how to simulate a native crash in React Native with react-native-global-exception-handler so you can test reporting, restart flows, and release-build behavior safely.
keywords:
  - simulate native crash react native
  - react native crash simulation
  - test native crash react native
  - react-native-global-exception-handler simulate crash
---

Use `simulateNativeCrash` when you need to verify that your React Native crash handler, monitoring service, and release-build recovery flow all behave the way you expect.

## When to simulate a crash

- Before shipping crash reporting to production
- After changing Sentry or Crashlytics integrations
- When validating Android restart behavior
- When confirming iOS limitations for native crash handling

## Basic example

```ts
import {
  CrashType,
  simulateNativeCrash,
} from 'react-native-global-exception-handler';

simulateNativeCrash(CrashType.nsexception);
```

## Guard the test behind development-only code

```ts
import {
  CrashType,
  simulateNativeCrash,
} from 'react-native-global-exception-handler';

if (__DEV__) {
  global.triggerNativeCrash = () => {
    simulateNativeCrash(CrashType.nsexception);
  };
}
```

## Recommended testing workflow

1. Install and configure the package using [Getting Started](../overview/getting-started.md).
2. Connect your monitoring provider:
   - [React Native Sentry Integration](./react-native-sentry-integration.md)
   - [React Native Crashlytics Integration](./react-native-crashlytics-integration.md)
3. Run a JS exception test first.
4. Run a native crash simulation in a release build.
5. Confirm the report appears in your monitoring platform and that the app terminates or recovers as expected.

## Important limitations

- Do not leave crash simulation triggers enabled in production builds.
- Native crash behavior differs between iOS and Android. See [Native Crash Handling](../usage/native-crash-handling.md) for platform limits.
- Some crash types are destructive by design; use a disposable test environment when possible.

## Troubleshooting

If simulation appears to do nothing:

- Confirm you are running on iOS or Android, not web.
- Confirm the crash type is valid for the current platform.
- Check [Troubleshooting](../troubleshooting.md) for debug-build limitations and common setup mistakes.

## Next steps

- [Basic Usage](../usage/basic-usage.md)
- [Testing guide](../advanced/testing.md)
- [API Reference](../api.md)
