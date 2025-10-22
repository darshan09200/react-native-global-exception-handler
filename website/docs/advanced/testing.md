---
id: testing
sidebar_position: 13
title: Testing
---

Learn how to safely test your error handling setup and simulate crashes in development.

## Simulating JavaScript Errors

To test your JS exception handler, throw an error in your app:

```js
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error, isFatal);
}, true);

// Somewhere in your code
throw new Error('Test JS Error');
```

## Simulating Native Crashes

Use the built-in [`simulateNativeCrash`](../api#simulatenativecrashcrashtype) function to trigger native crashes for testing. **Warning:** This will crash your app.

```js
import { simulateNativeCrash, CrashType } from 'react-native-global-exception-handler';

// Simulate a standard NSException (iOS) or equivalent (Android)
simulateNativeCrash(CrashType.nsexception);

// Simulate other crash types
simulateNativeCrash(CrashType.array_bounds);
simulateNativeCrash(CrashType.memory_access);
```

**Available Crash Types:** See the full list in the [CrashType section of the API Reference](../api#crashtype).

## Platform Support

- Works only on iOS and Android (not web)
- Some crash types may only be available on one platform

## Best Practices

- Only use crash simulation in development or QA builds
- Guard test code with `__DEV__` to avoid accidental production crashes:

```js
if (__DEV__) {
  global.simulateCrash = () => {
    simulateNativeCrash('nsexception');
  };
}
```

- Remove or disable test crash triggers before releasing your app

## Development Mode vs Production Mode

**Important:** Native exception handlers behave differently in dev vs production:

- **Development Mode**: Native exception handler is **NOT active** - you'll see the Red Screen
- **Production/Bundle Mode**: Native exception handler is **active** - your handler will be called

To test native exception handling:

1. **Build a production/release bundle**:

   ```bash npm2yarn
   # iOS
   npx react-native run-ios --configuration Release
   
   # Android
   npx react-native run-android --variant=release
   ```

2. **Or disable dev mode** in your code:

   ```js
   // Temporarily force production behavior for testing
   if (__DEV__) {
     console.log('Testing native handler in dev mode');
     // Note: Native handler still won't work, need release build
   }
   ```

**Why?** The Red Screen in development mode is designed to help you debug. Native exception handlers only activate in production builds to avoid interfering with React Native's development tools.

## Testing Analytics Integration

To verify that errors are sent to your analytics service:

1. Trigger a JS or native crash
2. Check your analytics dashboard for the error event
3. Use local logging or AsyncStorage to confirm handler execution

### Example: Verifying Handler Execution

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

setNativeExceptionHandler(async (errorString) => {
  // Log locally for verification
  await AsyncStorage.setItem('lastNativeCrash', JSON.stringify({
    error: errorString,
    timestamp: new Date().toISOString()
  }));
  
  // Send to analytics
  reportToAnalytics(errorString);
});

// Later, check if handler was called
AsyncStorage.getItem('lastNativeCrash').then(data => {
  if (data) {
    console.log('Last crash:', JSON.parse(data));
  }
});
```

## Troubleshooting

See [Troubleshooting](../troubleshooting)
