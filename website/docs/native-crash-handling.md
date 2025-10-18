---
id: native-crash-handling
sidebar_position: 4
title: Native Crash Handling
---

The library provides native exception handling for iOS and Android to catch crashes that occur in native code.

## How It Works

The library uses platform-specific native exception handlers:

- **iOS**: Installs an NSException handler and signal handlers
- **Android**: Installs an UncaughtExceptionHandler

When a native crash occurs, your handler function is called with the error message before the app terminates (or continues based on your options).

## Basic Usage

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

await setNativeExceptionHandler((errorString) => {
  // errorString contains the native error message/stack
  console.log('Native crash:', errorString);
  
  // Send to error monitoring
  reportToSentry(errorString);
});
```

## Platform-Specific Options

### Android Options

```ts
await setNativeExceptionHandler((errorString) => {
  // Handle error
}, {
  forceAppToQuit: true,  // Force app to terminate after handler runs
  callPreviouslyDefinedHandler: false  // Call previous handler
});
```

- `forceAppToQuit`: If `true`, forces the app to quit after your handler runs (Android only)
- `callPreviouslyDefinedHandler`: If `true`, calls any previously defined native handler

### iOS Options

```ts
await setNativeExceptionHandler((errorString) => {
  // Handle error
}, {
  callPreviouslyDefinedHandler: true  // Chain with previous handler
});
```

- `callPreviouslyDefinedHandler`: If `true`, calls any previously defined native exception handler

## Limitations

- Not all crashes can be intercepted (e.g., some signal-based crashes)
- On iOS, certain types of signals cannot be safely caught
- Handler runs synchronously before crash, so keep it lightweight
- Network calls may not complete before app terminates

## Best Practices

### 1. Keep Handler Lightweight

```ts
await setNativeExceptionHandler((errorString) => {
  // ✅ Good: Quick synchronous operations
  console.log(errorString);
  
  // ❌ Bad: Async operations that may not complete
  // await fetch('...'); // May not finish before crash
});
```

### 2. Persist Crash Data Locally

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

await setNativeExceptionHandler((errorString) => {
  // Store crash info locally
  try {
    AsyncStorage.setItem('lastCrash', JSON.stringify({
      error: errorString,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.log('Failed to save crash:', e);
  }
});

// On next app launch, check for stored crashes
async function checkForPreviousCrashes() {
  const lastCrash = await AsyncStorage.getItem('lastCrash');
  if (lastCrash) {
    // Send to monitoring service
    await reportCrash(JSON.parse(lastCrash));
    await AsyncStorage.removeItem('lastCrash');
  }
}
```

### 3. Integration with Error Monitoring

```ts
import * as Sentry from '@sentry/react-native';

await setNativeExceptionHandler((errorString) => {
  // Sentry has its own native crash handling, but you can add custom logic
  console.log('Native crash detected:', errorString);
  
  // Add breadcrumbs or custom data
  Sentry.addBreadcrumb({
    message: 'Native crash handler invoked',
    data: { error: errorString }
  });
});
```

## Testing Native Crashes

Use `simulateNativeCrash` to test your handler (⚠️ will crash your app):

```ts
import { simulateNativeCrash, CrashType } from 'react-native-global-exception-handler';

// Test different crash types
simulateNativeCrash(CrashType.nsexception);      // iOS NSException
simulateNativeCrash(CrashType.array_bounds);     // Array out of bounds
simulateNativeCrash(CrashType.memory_access);    // Memory access violation
```

See [API Reference](./api#testing--utilities) for all available crash types.
