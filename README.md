###### ⚠️ This is a fork of [react-native-exception-handler](https://github.com/a7ul/react-native-exception-handler). All credit goes to the original author

# react-native-global-exception-handler

[![npm version](https://img.shields.io/npm/v/react-native-global-exception-handler.svg)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![npm downloads](https://img.shields.io/npm/dm/react-native-global-exception-handler.svg)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![License: MIT](https://img.shields.io/github/license/darshan09200/react-native-global-exception-handler?color=green)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/darshan09200/react-native-global-exception-handler/pulls)

A modern React Native library that provides comprehensive global error handling for both JavaScript and native exceptions. Built with the latest React Native architecture including TurboModules support and cross-platform compatibility.

The library helps prevent abrupt app crashes by providing graceful error handling and customizable recovery options.

## Key Features

- 🔥 **Modern Architecture**: Built with TurboModules for React Native 0.68+
- 📱 **Cross-Platform**: Full iOS and Android support
- 🎯 **Dual Exception Handling**: Catches both JS and native exceptions
- 🔧 **Highly Customizable**: Configurable options for different platforms
- 🚀 **Crash Simulation**: Built-in crash testing for development
- 🎨 **Custom Error UI**: Platform-specific error screens with restart functionality
- ⚡ **TypeScript Support**: Full TypeScript definitions included

## What This Solves

In the current React Native ecosystem:

- `In DEV mode`: You get a RED screen error pointing to your errors
- `In RELEASE mode`: The app just quits without any user feedback! 🙄

This library provides:

1. **Graceful Error Handling**: Show user-friendly error messages instead of crashes
2. **Crash Reporting**: Send error reports to your analytics/monitoring service
3. **App Recovery**: Built-in restart functionality for better user experience
4. **Development Tools**: Crash simulation for testing error handling

## Demo

| iOS | Android |
| -- | -- |
| <video src="./docs/assets/iOS_demo.mp4" width="350"/> | <video src="./docs/assets/android_demo.mp4" width="350"/> |

## Installation

```sh
npm install react-native-global-exception-handler
```

or

```sh
yarn add react-native-global-exception-handler
```

### For React Native 0.68+

This library uses TurboModules and auto-linking, so no additional setup is required for modern React Native versions.

### For React Native < 0.68

Please use react-native-exception-handler (the original library) for older React Native versions.

## Basic Usage

### JavaScript Exception Handling

```js
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

// Basic setup
setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error);
  
  if (isFatal) {
    // Handle fatal errors - maybe show restart dialog
  } else {
    // Handle non-fatal errors - maybe just log them
  }
});

// Advanced setup with dev mode control
setJSExceptionHandler(
  (error, isFatal) => {
    // Your error handler
  },
  true // Allow in dev mode (shows instead of RedBox)
);
```

### Native Exception Handling

```js
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

// Basic setup with default options
setNativeExceptionHandler((errorString) => {
  console.log('Native Exception:', errorString);
  // Send to crash reporting service
});

// Advanced setup with platform-specific options
setNativeExceptionHandler(
  (errorString) => {
    console.log('Native Exception:', errorString);
  },
  {
    forceAppToQuit: true,              // Android: Force app to quit after error
    callPreviouslyDefinedHandler: false // Call previous exception handler
  }
);

// Legacy API (still supported)
setNativeExceptionHandler(
  (errorString) => { /* handler */ },
  true,  // forceAppToQuit (Android)
  false  // executeDefaultHandler (iOS)
);
```

## API Reference

### `setJSExceptionHandler(handler, allowInDevMode?)`

Registers a global JavaScript exception handler.

**Parameters:**

- `handler: (error: Error, isFatal: boolean) => void` - The exception handler function
- `allowInDevMode?: boolean` - Whether to show handler in dev mode (default: false)

### `setNativeExceptionHandler(handler, options?)`

Registers a global native exception handler with platform-specific options.

**Parameters:**

- `handler: (errorString: string) => void` - The exception handler function
- `options?: ExceptionHandlerOptions` - Platform-specific configuration

**Options:**

```typescript
interface ExceptionHandlerOptions {
 callPreviouslyDefinedHandler?: boolean; // Call previous handler (default: false)
 forceAppToQuit?: boolean;              // Android: Force app quit (default: true)
}
```

### `simulateNativeCrash(crashType?)`

Simulates a native crash for testing purposes (DEV mode only).

**Crash Types:**

- `'nsexception'` - Standard exception (default)
- `'array_bounds'` - Array bounds exception
- `'invalid_argument'` - Invalid argument exception
- `'memory_access'` - Memory access violation
- `'abort'` - Abort signal
- `'stack_overflow'` - Stack overflow
- `'internal_inconsistency'` - Internal inconsistency
- `'malloc_error'` - Memory allocation error
- `'sigill'` - Illegal instruction
- `'sigbus'` - Bus error

```js
import { simulateNativeCrash } from 'react-native-global-exception-handler';

// Simulate different crash types for testing
simulateNativeCrash('memory_access');
simulateNativeCrash('array_bounds');
```

### `getJSExceptionHandler()`

Returns the currently set JavaScript exception handler.

## Examples

### Complete Error Handling Setup

```js
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler,
  simulateNativeCrash 
} from 'react-native-global-exception-handler';
import { Alert, Platform } from 'react-native';

// Setup JS exception handling
setJSExceptionHandler((error, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected Error',
      `A fatal error occurred: ${error.name}\n${error.message}\n\nThe app will need to restart.`,
      [{ 
        text: 'Restart App', 
        onPress: () => {
          // Restart logic here
        }
      }]
    );
  } else {
    // Log non-fatal errors
    console.warn('Non-fatal JS error:', error);
  }
}, false);

// Setup native exception handling
setNativeExceptionHandler(
  (errorString) => {
    // Send to crash reporting
    console.log('Native error occurred:', errorString);
    
    // You can send to services like:
    // - Crashlytics
    // - Sentry
    // - Bugsnag
    // - Custom analytics endpoint
  },
  {
    forceAppToQuit: Platform.OS === 'android', // Android specific
    callPreviouslyDefinedHandler: false        // iOS specific
  }
);
```

### Testing Error Handling

```js
import { simulateNativeCrash } from 'react-native-global-exception-handler';

// Test different crash scenarios
const testCrashes = () => {
  // Test JS error
  throw new Error('Test JS Error');
};

const testNativeCrash = () => {
  simulateNativeCrash('array_bounds');
};

// In your component
<Button title="Test JS Error" onPress={testCrashes} />
<Button title="Test Native Crash" onPress={testNativeCrash} />
```

## Customization

### Custom Native Error Screen (Android)

You can customize the native error screen that appears when a native exception occurs on Android:

#### Method 1: Custom Exception Handler Interface

```kotlin
// In your MainApplication.kt
import com.globalexceptionhandler.GlobalExceptionHandlerModule
import com.globalexceptionhandler.NativeExceptionHandlerIfc

class MainApplication : Application(), ReactApplication {
    override fun onCreate() {
        super.onCreate()
        
        // Set custom native exception handler
        GlobalExceptionHandlerModule.setNativeExceptionHandler(object : NativeExceptionHandlerIfc {
            override fun handleNativeException(
                thread: Thread,
                throwable: Throwable,
                originalHandler: Thread.UncaughtExceptionHandler?
            ) {
                // Custom handling logic
                // - Send to analytics
                // - Show custom UI
                // - Clean up resources
            }
        })
    }
}
```

#### Method 2: Custom Error Activity

```kotlin
// Create CustomErrorActivity.kt
class CustomErrorActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Your custom error UI
        setContentView(R.layout.custom_error_layout)
    }
}

// In MainApplication.kt
override fun onCreate() {
    super.onCreate()
    
    GlobalExceptionHandlerModule.replaceErrorScreenActivityClass(
        CustomErrorActivity::class.java
    )
}
```

### Custom Native Error Screen (iOS)

For iOS customization, modify your `AppDelegate.m`:

```objc
#import "GlobalExceptionHandler.h"

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Your existing setup...
    
    // Custom native exception handler
    [GlobalExceptionHandler replaceNativeExceptionHandlerBlock:^(NSException *exception, NSString *readeableException) {
        // Create custom alert
        UIAlertController* alert = [UIAlertController
            alertControllerWithTitle:@"App Error"
            message:[NSString stringWithFormat:@"An unexpected error occurred.\n%@", readeableException]
            preferredStyle:UIAlertControllerStyleAlert];
        
        // Present the alert
        [self.window.rootViewController presentViewController:alert animated:YES completion:nil];
        
        // Auto-close after 4 seconds
        [NSTimer scheduledTimerWithTimeInterval:4.0
                                         target:[GlobalExceptionHandler class]
                                       selector:@selector(releaseExceptionHold)
                                       userInfo:nil
                                        repeats:NO];
    }];
    
    return YES;
}
```

## Integration with Analytics Services

### Crashlytics

```js
import crashlytics from '@react-native-firebase/crashlytics';

setJSExceptionHandler((error, isFatal) => {
    crashlytics().recordError(error);
});

setNativeExceptionHandler((errorString) => {
    crashlytics().log(errorString);
});
```

### Sentry

```js
import * as Sentry from '@sentry/react-native';

setJSExceptionHandler((error, isFatal) => {
    Sentry.captureException(error);
});

setNativeExceptionHandler((errorString) => {
    Sentry.captureMessage(errorString);
});
```

## Platform Differences

### iOS

- Cannot restart app programmatically after native crash
- UI becomes unstable during native exceptions
- Best practice: Show informative message and ask user to restart
- Exception handler must call `releaseExceptionHold()` to close app

### Android

- Can restart app after native crash
- More stable during native exceptions
- Built-in restart functionality in default error screen
- More customization options available

## Troubleshooting

### TurboModule Issues

If you encounter TurboModule binding issues:

1. Ensure you're using React Native 0.68+
2. Clear metro cache: `npx react-native start --reset-cache`
3. Clean and rebuild: `cd android && ./gradlew clean && cd .. && npx react-native run-android`

### Android Build Issues

If you encounter Android build issues:

1. Check that your `android/build.gradle` has the correct Kotlin version
2. Ensure your target SDK is compatible
3. Try cleaning: `cd android && ./gradlew clean`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with ❤️ for the React Native community

## TODO

- [ ] Add examples for old and new arch
- [ ] Add examples for custom error screen
- [ ] Update docs for old/new arch, custom error screen
  - [ ] native handlers on android in debug mode might not work as expected
- [ ] Possible add e2e tests
