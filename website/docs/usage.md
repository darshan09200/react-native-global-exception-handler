---
id: usage
sidebar_position: 3
title: Usage
---

## JavaScript Exception Handling

Set up a global handler for JavaScript exceptions in your app's entry point (`index.js` or `App.tsx`):

```ts
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  // Send to error monitoring service (e.g., Sentry, Bugsnag)
  console.log('JS Exception:', error.message, 'Fatal:', isFatal);
  
  if (isFatal) {
    // Show crash screen or force restart
  }
}, true); // true = enable in dev mode
```

**Parameters:**

- First parameter: Handler function receiving `(error: Error, isFatal: boolean)`
- Second parameter: `allowedInDevMode` - Set to `true` to enable in development (default: `false`)

## Native Exception Handling

Handle native crashes on iOS and Android:

```ts
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

await setNativeExceptionHandler((errorString) => {
  // errorString contains the native error message
  console.log('Native Exception:', errorString);
  
  // Send to error monitoring
}, {
  forceAppToQuit: true,  // Android: Force app to quit after handling
  callPreviouslyDefinedHandler: false  // Call previous handler (iOS/Android)
});
```

**Options:**

- `forceAppToQuit` (Android only): Force app to quit after handler runs
- `callPreviouslyDefinedHandler`: Chain with previous native exception handler

## Complete Setup Example

In your `index.js`:

```ts
import { AppRegistry } from 'react-native';
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler 
} from 'react-native-global-exception-handler';
import App from './App';
import { name as appName } from './app.json';

// JavaScript exception handler
setJSExceptionHandler((error, isFatal) => {
  // Send to monitoring service
  console.log('JS Error:', error, isFatal);
}, true);

// Native exception handler
setNativeExceptionHandler((errorString) => {
  // Send to monitoring service
  console.log('Native Error:', errorString);
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
});

AppRegistry.registerComponent(appName, () => App);
```

## Development vs Production

By default, JS exception handler only works in production builds. Enable in development:

```ts
// Only in production (default)
setJSExceptionHandler(handler);

// Also in development
setJSExceptionHandler(handler, true);

// Or check manually
const isDev = __DEV__;
setJSExceptionHandler(handler, !isDev); // Only in production
```

## Getting the Current Handler

Retrieve the currently set JavaScript exception handler:

```ts
import { getJSExceptionHandler } from 'react-native-global-exception-handler';

const currentHandler = getJSExceptionHandler();
```
