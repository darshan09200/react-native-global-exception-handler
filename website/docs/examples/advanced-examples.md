---
id: advanced-examples
sidebar_position: 2
title: Advanced Examples
description: Advanced usage patterns - app restart after crash, chaining existing handlers, recovery strategies, and native customization tips.
keywords:
  - advanced
  - examples
  - restart
  - chaining
  - recovery
  - customization
---

## Restarting the App After an Error

A common pattern is to restart the app after a fatal error to give users a fresh start. Here's how to implement it with a package like `react-native-restart`:

```bash npm2yarn
npm install react-native-restart
```

Then use it in your error handler:

```ts
import { Platform, Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `
      Error: ${isFatal ? 'Fatal' : ''} ${error.name} ${error.message}
        
      We will need to restart the app.
      `,
      [
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ]
    );
  }
});

setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
    ...
    ...
   // When you call setNativeExceptionHandler, react-native-global-exception-handler sets a
   // Native Exception Handler popup which supports restart on error in case of android.
   // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
   // To customize the popup screen take a look at CUSTOMIZATION section.
}, {
  forceAppToQuit: true
});
```

## Chaining Previous Handlers (Advanced)

If another library (e.g. analytics SDK) already set a JS handler, you can chain it:

```ts
import { setJSExceptionHandler, getJSExceptionHandler } from 'react-native-global-exception-handler';

const previousHandler = getJSExceptionHandler();

setJSExceptionHandler((error, isFatal) => {
  // Custom logic
  console.log('Custom JS handler', error.message);
  // Call previous if exists
  if (previousHandler) previousHandler(error, isFatal);
}, true);
```

For native exceptions, pass `callPreviouslyDefinedHandler: true` in options to chain automatically.

```ts
setNativeExceptionHandler((errorString) => {
  console.log('Native error:', errorString);
}, { callPreviouslyDefinedHandler: true });
```

## Using `forceAppToQuit: false` (Android)

Rarely, you may want the app to attempt recovery after a native crash (e.g. when using certain navigation libraries). Set `forceAppToQuit: false`:

```ts
setNativeExceptionHandler((errorString) => {
  console.log('Attempting recovery after native crash');
  // Limited operations; app state may be unstable
}, { forceAppToQuit: false });
```

> Recovery isn't guaranteed; most native crashes leave the app in an inconsistent state. Default (`true`) is safer.
