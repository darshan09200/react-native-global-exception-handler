---
id: basic-examples
title: Basic examples
sidebar_position: 1
---



## JavaScript

### Basic Setup

```ts
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-global-exception-handler';
import { Alert, Platform } from 'react-native';

setJSExceptionHandler((error, isFatal) => {
  if (isFatal) {
    Alert.alert('Unexpected Error', `${error.name}: ${error.message}`, [{ text: 'OK' }]);
  } else {
    console.warn('Non-fatal JS error', error);
  }
}, true);

setNativeExceptionHandler((errorString) => {
  console.log('Native Exception:', errorString);
}, { forceAppToQuit: Platform.OS === 'android', callPreviouslyDefinedHandler: false });
```

### Full Error Dialog

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';
import { Alert } from 'react-native';

setJSExceptionHandler((error, fatal) => {
  if (!fatal) return;
  Alert.alert(
    'App Error',
    `A fatal error occurred and the app needs to restart.\n${error.message}`,
    [
      { text: 'Restart', onPress: () => {/* implement restart logic */} },
      { text: 'Report', onPress: () => {/* send to analytics */} }
    ]
  );
});
```

### Crash Simulation (DEV Only)

```ts
import { simulateNativeCrash } from 'react-native-global-exception-handler';

// Trigger an array bounds crash
simulateNativeCrash('array_bounds');
```

### Chaining Previous JS Handler

```ts
import { setJSExceptionHandler, getJSExceptionHandler } from 'react-native-global-exception-handler';

const prev = getJSExceptionHandler();
setJSExceptionHandler((e, fatal) => {
  // custom logic
  if (prev) prev(e, fatal);
});
```

## Native

### Minimal Native Handler (Object Form)

```ts
setNativeExceptionHandler(handlerFn, { forceAppToQuit: true, callPreviouslyDefinedHandler: false });
```

### Deprecated Positional Native API

```ts
// Still works but not recommended
setNativeExceptionHandler(handlerFn, true, false);
```

### Custom Error Screen (Android)

```kotlin
// In MainApplication.kt
GlobalExceptionHandlerModule.replaceErrorScreenActivityClass(CustomErrorActivity::class.java)
```

> See [customization guide](../advanced/customization.md) for full Activity implementation.
