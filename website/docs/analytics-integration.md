---
id: analytics-integration
sidebar_position: 11
title: Analytics & Monitoring Integration
---

Learn how to integrate `react-native-global-exception-handler` with popular error monitoring and analytics services.

## Firebase Crashlytics

[Firebase Crashlytics](https://firebase.google.com/products/crashlytics) provides real-time crash reporting.

### Installation

```bash
npm install @react-native-firebase/app @react-native-firebase/crashlytics
# or
yarn add @react-native-firebase/app @react-native-firebase/crashlytics
```

### Integration

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

## Sentry

[Sentry](https://sentry.io/) provides comprehensive error tracking and performance monitoring.

### Installation

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

### Integration

```js
import * as Sentry from '@sentry/react-native';
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler 
} from 'react-native-global-exception-handler';

// Initialize Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableAutoSessionTracking: true,
  tracesSampleRate: 1.0,
});

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

### Advanced Sentry Integration

Add breadcrumbs and context for better debugging:

```js
setJSExceptionHandler((error, isFatal) => {
  // Add breadcrumb
  Sentry.addBreadcrumb({
    category: 'error',
    message: 'JS Exception occurred',
    level: isFatal ? 'fatal' : 'error',
    data: {
      error_name: error.name,
      error_message: error.message
    }
  });
  
  // Set user context
  Sentry.setUser({
    id: 'user-id',
    email: 'user@example.com'
  });
  
  // Set extra context
  Sentry.setContext('error_details', {
    isFatal,
    timestamp: new Date().toISOString()
  });
  
  // Capture the exception
  Sentry.captureException(error);
}, true);
```
