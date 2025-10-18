---
id: troubleshooting
sidebar_position: 12
title: Troubleshooting
---

Common issues and solutions when working with `react-native-global-exception-handler`.

## Installation Issues

### TurboModule Not Found

**Error:**

```
TurboModuleRegistry.getEnforcing called for module 'GlobalExceptionHandler' but it is not registered
```

**Solution:**

1. Ensure you're using React Native 0.68 or higher
2. Clear metro cache:

   ```bash
   npx react-native start --reset-cache
   ```

3. Clean and rebuild:

   ```bash
   # iOS
   cd ios && rm -rf Pods && pod install && cd ..
   npx react-native run-ios
   
   # Android
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

### iOS Pod Installation Fails

**Error:**

```
[!] CocoaPods could not find compatible versions for pod "GlobalExceptionHandler"
```

**Solution:**

1. Update CocoaPods:

   ```bash
   sudo gem install cocoapods
   ```

2. Clean and reinstall:

   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod deintegrate
   pod install
   cd ..
   ```

### Android Build Fails

**Error:**

```
Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'
```

**Solution:**

1. Ensure your `android/build.gradle` has correct Kotlin version:

   ```gradle
   buildscript {
       ext {
           kotlinVersion = "1.8.0"
       }
   }
   ```

2. Clean gradle cache:

   ```bash
   cd android
   ./gradlew clean
   ./gradlew cleanBuildCache
   cd ..
   ```

## Runtime Issues

### Handler Not Called in Development

**Issue:** Exception handler doesn't trigger in development mode.

**Solution:**

For JavaScript exceptions, enable dev mode:

```js
setJSExceptionHandler((error, isFatal) => {
  // Your handler
}, true); // ← Set to true to enable in dev mode
```

**Note:** Android native handlers may not work as expected in debug mode due to the way debug builds handle uncaught exceptions.

### Native Handler Not Working on Android (Debug)

**Issue:** Native exception handler doesn't trigger in Android debug builds.

**Explanation:**

In debug mode, React Native's debug infrastructure may interfere with native exception handling. This is expected behavior.

**Solution:**

Test native exception handling in release builds:

```bash
npx react-native run-android --variant=release
```

### App Doesn't Restart After Crash

**Issue:** App shows error but doesn't provide restart functionality.

**Solution:**

For Android, ensure `forceAppToQuit` is configured:

```js
setNativeExceptionHandler((errorString) => {
  // Handle error
}, {
  forceAppToQuit: true  // Required for proper cleanup
});
```

For iOS, you must use a custom error screen as iOS doesn't allow programmatic restart.

### Errors Not Reaching Analytics Service

**Issue:** Errors are captured but not sent to your analytics service.

**Solution:**

1. Check network connectivity in error handler
2. Queue errors locally for retry:

   ```js
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   const queueError = async (error) => {
     const queue = await AsyncStorage.getItem('error_queue');
     const errors = queue ? JSON.parse(queue) : [];
     errors.push(error);
     await AsyncStorage.setItem('error_queue', JSON.stringify(errors));
   };
   
   setJSExceptionHandler((error, isFatal) => {
     queueError({ error, isFatal });
   }, true);
   ```

## Testing Issues

### `simulateNativeCrash` Doesn't Work

**Issue:** Calling `simulateNativeCrash` has no effect.

**Solution:**

1. Ensure you're running on a real device or simulator (not web)
2. Check platform:

   ```js
   import { Platform } from 'react-native';
   
   if (Platform.OS === 'ios' || Platform.OS === 'android') {
     simulateNativeCrash('nsexception');
   } else {
     console.log('Not supported on this platform');
   }
   ```

3. Verify the crash type is valid for your platform

### Test Crashes Affect Production

**Issue:** Accidentally left crash simulation code in production build.

**Solution:**

Use `__DEV__` flag to prevent test code in production:

```js
import { simulateNativeCrash } from 'react-native-global-exception-handler';

if (__DEV__) {
  // Only available in dev builds
  global.simulateCrash = () => {
    simulateNativeCrash('nsexception');
  };
}
```

## Performance Issues

### App Sluggish After Setting Handler

**Issue:** App performance degrades after setting exception handlers.

**Solution:**

Keep handlers lightweight:

```js
// ❌ Bad - Heavy synchronous operation
setJSExceptionHandler((error, isFatal) => {
  // Expensive operation
  const largeData = processHugeDataset();
  sendToServer(largeData);
}, true);

// ✅ Good - Async operation
setJSExceptionHandler((error, isFatal) => {
  // Queue for later processing
  setTimeout(() => {
    sendToServer(error);
  }, 0);
}, true);
```

### Memory Leaks from Error Handlers

**Issue:** Memory usage increases over time.

**Solution:**

Avoid storing references in closures:

```js
// ❌ Bad - Closure captures large data
let largeData = /* ... */;
setJSExceptionHandler((error, isFatal) => {
  console.log(largeData); // Keeps largeData in memory
}, true);

// ✅ Good - No closure captures
setJSExceptionHandler((error, isFatal) => {
  // Get fresh data when needed
  const data = getCurrentData();
  console.log(data);
}, true);
```

## Type Issues (TypeScript)

### Type Errors with Handler Functions

**Error:**

```typescript
Type '(error: Error, isFatal: boolean) => void' is not assignable to type 'JSExceptionHandler'
```

**Solution:**

Import types from the library:

```typescript
import { 
  setJSExceptionHandler, 
  type JSExceptionHandler 
} from 'react-native-global-exception-handler';

const handler: JSExceptionHandler = (error, isFatal) => {
  console.log(error);
};

setJSExceptionHandler(handler, true);
```

### Options Type Not Recognized

**Error:**

```typescript
Property 'forceAppToQuit' does not exist on type '{}'
```

**Solution:**

Import `ExceptionHandlerOptions` type:

```typescript
import { 
  setNativeExceptionHandler,
  type ExceptionHandlerOptions 
} from 'react-native-global-exception-handler';

const options: ExceptionHandlerOptions = {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
};

setNativeExceptionHandler((error) => {
  console.log(error);
}, options);
```

## Compatibility Issues

### React Native Version Mismatch

**Error:**

```
The package react-native-global-exception-handler requires React Native 0.68+
```

**Solution:**

This library requires React Native 0.68 or higher. If you're using an older version:

1. Upgrade React Native:

   ```bash
   npx react-native upgrade
   ```

2. Or use the original library for older versions:

   ```bash
   npm install react-native-exception-handler
   ```

### Hermes Not Enabled

**Issue:** Some features don't work without Hermes engine.

**Solution:**

Enable Hermes in your app:

**iOS** (`ios/Podfile`):

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => true
)
```

**Android** (`android/app/build.gradle`):

```gradle
project.ext.react = [
    enableHermes: true
]
```

## Getting More Help

If you're still experiencing issues:

1. **Check existing issues**: [GitHub Issues](https://github.com/darshan09200/react-native-global-exception-handler/issues)
2. **Create a new issue**: Include:
   - React Native version
   - Platform (iOS/Android)
   - Error message
   - Minimal reproduction code
3. **Enable verbose logging**:

   ```js
   setJSExceptionHandler((error, isFatal) => {
     console.log('Error details:', {
       name: error.name,
       message: error.message,
       stack: error.stack,
       isFatal
     });
   }, true);
   ```

## Debug Mode

Enable detailed logging for troubleshooting:

```js
// Add to your index.js
if (__DEV__) {
  console.log('Global Exception Handler - Debug Mode');
  
  setJSExceptionHandler((error, isFatal) => {
    console.log('=== JS Exception Caught ===');
    console.log('Fatal:', isFatal);
    console.log('Error:', error);
    console.log('Stack:', error.stack);
    console.log('==========================');
  }, true);
  
  setNativeExceptionHandler((errorString) => {
    console.log('=== Native Exception Caught ===');
    console.log('Error:', errorString);
    console.log('===============================');
  });
}
```
