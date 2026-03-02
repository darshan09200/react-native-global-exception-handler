---
id: react-native-crashlytics-integration
title: Crashlytics Integration
sidebar_label: Crashlytics
sidebar_position: 4
description: Send JavaScript exceptions and native crash messages from react-native-global-exception-handler to Firebase Crashlytics in React Native.
keywords:
  - react native crashlytics exception handler
  - react native crashlytics crash handling
  - firebase crashlytics react native exception handler
  - react-native-global-exception-handler crashlytics
---

This setup keeps `react-native-global-exception-handler` as the single registration point for crash handling while sending reports to Firebase Crashlytics.

## Install the dependencies

```bash npm2yarn
npm install react-native-global-exception-handler @react-native-firebase/app @react-native-firebase/crashlytics
cd ios && pod install
```

Then complete the core package setup from [Installation](../overview/installation.md).

## Record JavaScript exceptions

If you already have Crashlytics initialized, the smallest useful setup looks like this:

```ts
import crashlytics from '@react-native-firebase/crashlytics';
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  crashlytics().recordError(error);
  crashlytics().setAttribute('layer', 'javascript');
  crashlytics().setAttribute('is_fatal', String(isFatal));
}, true);
```

## Record native crash messages

Then register the native handler:

```ts
import { Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  crashlytics().log(errorString);
  crashlytics().setAttribute('layer', 'native');
  crashlytics().setAttribute('platform', Platform.OS);
}, {
  forceAppToQuit: Platform.OS === 'android',
  callPreviouslyDefinedHandler: false,
});
```

## Recommended production pattern

```ts
import { Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  crashlytics().recordError(error);
  crashlytics().setAttributes({
    layer: 'javascript',
    is_fatal: String(isFatal),
  });
}, true);

setNativeExceptionHandler((errorString) => {
  crashlytics().log(errorString);
  crashlytics().setAttributes({
    layer: 'native',
    platform: Platform.OS,
  });
}, {
  forceAppToQuit: Platform.OS === 'android',
  callPreviouslyDefinedHandler: false,
});
```

## What to watch for

- Crashlytics setup must already be complete for your app before these handlers run.
- Native exception handlers should not do heavy synchronous work.
- Android restart logic and `forceAppToQuit` behavior still matter even if Crashlytics is attached. Read [Native Crash Handling](../usage/native-crash-handling.md) before changing the defaults.

## Verify before shipping

1. Test a JavaScript exception in development.
2. Use [Simulate Native Crash in React Native](./simulate-native-crash-in-react-native.md) in a release build.
3. Confirm the events are visible in Firebase.
4. Re-check [Troubleshooting](../troubleshooting.md) if callbacks are skipped or native builds fail.

## Next steps

- [See full API options](../api.md)
- [Read the basic usage guide](../usage/basic-usage.md)
