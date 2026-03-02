---
id: analytics-integration
sidebar_position: 3
title: Analytics Integration Patterns
sidebar_label: Analytics
description: Overview of analytics and monitoring patterns for react-native-global-exception-handler, with links to dedicated Sentry and Crashlytics integration guides.
keywords:
  - analytics
  - sentry
  - crashlytics
  - monitoring
  - integration
---

This page is the analytics overview for `react-native-global-exception-handler`. It keeps the shared patterns and one custom example here, while the dedicated Sentry and Crashlytics pages keep the provider-specific setup.

## Choose the reporting path you need

- [React Native Sentry Integration](./react-native-sentry-integration.md): dedicated setup for forwarding JavaScript exceptions and native crash messages into Sentry.
- [React Native Crashlytics Integration](./react-native-crashlytics-integration.md): Firebase Crashlytics-specific setup for production monitoring.
- Custom analytics: use your own API or event pipeline if you do not want a third-party crash platform.

## Shared integration pattern

No matter which provider you choose, the architecture is usually the same:

1. Initialize the analytics SDK first.
2. Register `setJSExceptionHandler` for JavaScript errors.
3. Register `setNativeExceptionHandler` for native crash messages.
4. Keep the native handler lightweight.
5. Verify the behavior in a release build.

## Lightweight shared example

```ts
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('report JS error', error.message, isFatal);
}, true);

setNativeExceptionHandler((errorString) => {
  console.log('report native error', errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

## Custom analytics example

```ts
import { Alert, BackHandler } from 'react-native';
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

const reportError = (error: Error) => {
  // Example: send to your API or analytics
  console.log('Reporting error:', error.message);
};

setJSExceptionHandler((error, isFatal) => {
  if (isFatal) {
    reportError(error);
    Alert.alert(
      'Unexpected error occurred',
      `Fatal: ${error.name}\n${error.message}\nThe app will now close.`,
      [
        {
          text: 'Close',
          onPress: () => BackHandler.exitApp()
        }
      ]
    );
  } else {
    // Non-fatal - could still log/report
    console.warn('Non-fatal error:', error.message);
  }
}, true);

setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  //example
  // fetch('http://<YOUR API TO REPORT TO DEV TEAM>?error='+errorString);
  //
}, {
  forceAppToQuit: true
});
```

## Queue before sending

If you do not trust the network path during a fatal error, queue data first and upload it later:

```ts
const queueError = async (payload: unknown) => {
  // persist locally, then upload next launch
  console.log('queued', payload);
};

setJSExceptionHandler((error, isFatal) => {
  queueError({
    layer: 'javascript',
    isFatal,
    message: error.message,
  });
}, true);
```

## Release validation

After wiring a provider, use [Simulate Native Crash in React Native](./simulate-native-crash-in-react-native.md) and the [Testing](../advanced/testing.md) guide to confirm that the monitoring pipeline captures both JavaScript and native failures.

## Next steps

- [React Native Sentry Integration](./react-native-sentry-integration.md)
- [React Native Crashlytics Integration](./react-native-crashlytics-integration.md)
- [Troubleshooting](../troubleshooting.md)
