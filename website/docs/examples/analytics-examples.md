---
id: analytics-integration
sidebar_position: 3
title: Analytics Integration 
description: Examples for integrating react-native-global-exception-handler with Sentry, Crashlytics, and custom analytics for reporting JS and native crashes.
keywords:
  - analytics
  - sentry
  - crashlytics
  - monitoring
  - integration
---

Quick reference snippets for wiring `react-native-global-exception-handler` into popular monitoring services. (Assumes the service SDKs are already installed & initialized.)

## Sentry

```js
import * as Sentry from '@sentry/react-native';
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler 
} from 'react-native-global-exception-handler';

// JavaScript exceptions
setJSExceptionHandler((error, isFatal) => {
  Sentry.captureException(error, {
    level: isFatal ? 'fatal' : 'error',
    tags: {
      error_type: 'javascript',
      is_fatal: isFatal
    }
  });
}, true);

// Native exceptions
setNativeExceptionHandler((errorString) => {
  Sentry.captureMessage(errorString, {
    level: 'fatal',
    tags: {
      error_type: 'native'
    }
  });
});
```

## Crashlytics

```js
import crashlytics from '@react-native-firebase/crashlytics';
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler 
} from 'react-native-global-exception-handler';

// JavaScript exceptions
setJSExceptionHandler((error, isFatal) => {
  crashlytics().recordError(error);
  
  if (isFatal) {
    crashlytics().log('Fatal JS error occurred');
    crashlytics().setAttribute('error_type', 'fatal_js');
  }
}, true);

// Native exceptions
setNativeExceptionHandler((errorString) => {
  crashlytics().log(errorString);
  crashlytics().setAttribute('error_type', 'native');
});
```

## Custom Analytics

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
