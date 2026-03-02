---
id: react-native-sentry-integration
title: Sentry Integration
sidebar_label: Sentry
sidebar_position: 3
description: Learn how to send JavaScript exceptions and native crash details from react-native-global-exception-handler to Sentry in a React Native app.
keywords:
  - react native sentry exception handler
  - react native sentry crash handling
  - sentry react-native-global-exception-handler
  - react native js native crash reporting
---

This setup forwards JavaScript exceptions and native crash messages into Sentry while keeping `react-native-global-exception-handler` as the place where your app registers handlers.

## When this setup is a good fit

- You already use `@sentry/react-native`.
- You want one React Native exception handler for both JS and native failures.
- You need a documented path from install to crash-report verification.

## Install the required packages

Install both libraries if Sentry is not already present:

```bash npm2yarn
npm install react-native-global-exception-handler @sentry/react-native
cd ios && pod install
```

Then finish the base package setup from [Installation](../overview/installation.md).

## Register Sentry in your app entry point

Initialize Sentry before you register the exception handlers.

```ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  tracesSampleRate: 0.1,
});
```

## Send JavaScript exceptions to Sentry

For most apps, this is the minimum JavaScript integration:

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  Sentry.captureException(error, {
    level: isFatal ? 'fatal' : 'error',
    tags: {
      layer: 'javascript',
      isFatal: String(isFatal),
    },
  });
}, true);
```

Use `true` for the second argument if you also want to validate JS handling in development.

If another library already installed a JS handler, you can chain it:

```ts
import {
  getJSExceptionHandler,
  setJSExceptionHandler,
} from 'react-native-global-exception-handler';

const previousHandler = getJSExceptionHandler();

setJSExceptionHandler((error, isFatal) => {
  Sentry.captureException(error);
  if (previousHandler) {
    previousHandler(error, isFatal);
  }
}, true);
```

## Send native crash messages to Sentry

The native side is usually just message forwarding plus minimal tags:

```ts
import { Platform } from 'react-native';
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  Sentry.captureMessage(errorString, {
    level: 'fatal',
    tags: {
      layer: 'native',
      platform: Platform.OS,
    },
  });
}, {
  forceAppToQuit: Platform.OS === 'android',
  callPreviouslyDefinedHandler: false,
});
```

If you already have another native handler in place and want to preserve it:

```ts
setNativeExceptionHandler((errorString) => {
  Sentry.captureMessage(errorString, { level: 'fatal' });
}, {
  forceAppToQuit: Platform.OS === 'android',
  callPreviouslyDefinedHandler: true,
});
```

## Complete example

```ts
import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
});

setJSExceptionHandler((error, isFatal) => {
  Sentry.captureException(error, {
    level: isFatal ? 'fatal' : 'error',
    tags: { layer: 'javascript' },
  });
}, true);

setNativeExceptionHandler((errorString) => {
  Sentry.captureMessage(errorString, {
    level: 'fatal',
    tags: { layer: 'native', platform: Platform.OS },
  });
}, {
  forceAppToQuit: Platform.OS === 'android',
  callPreviouslyDefinedHandler: false,
});
```

## Limitations and caveats

- Native crash handlers run very late in the failure path, so keep the handler lightweight.
- iOS cannot reliably support interactive UI after a native crash. Review [Native Crash Handling](../usage/native-crash-handling.md) before building a custom fallback.
- Some fatal native crashes can terminate the app before asynchronous work completes. If you need stronger guarantees, pair this with server-side deduplication and device-side buffering strategies.

## Verify the integration

1. Follow the [Getting Started](../overview/getting-started.md) setup if you have not registered handlers yet.
2. Trigger a JS exception and confirm it appears in Sentry.
3. Test a release-build native crash using [Simulate Native Crash in React Native](./simulate-native-crash-in-react-native.md).
4. Review [Troubleshooting](../troubleshooting.md) if native callbacks do not fire in development.

## Next steps

- [Install react-native-global-exception-handler](../overview/installation.md)
- [See the API Reference](../api.md)
- [Compare with the legacy package](../migration/react-native-exception-handler-vs-react-native-global-exception-handler.md)
