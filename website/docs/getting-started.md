---
id: getting-started
sidebar_position: 1
slug: /getting-started
title: Getting Started
---

Welcome to `react-native-global-exception-handler`.

This library lets you capture uncaught JavaScript exceptions and native crashes in React Native apps and gives you a single place to report them (e.g. Sentry, Bugsnag, your own backend) and perform graceful recovery.

## Installation

### Using npm

```bash
npm install react-native-global-exception-handler
```

### Using yarn

```bash
yarn add react-native-global-exception-handler
```

### Using pnpm

```bash
pnpm add react-native-global-exception-handler
```

Then install pods for iOS:

```bash
cd ios && pod install
```

## Quick Setup

In your `index.js` or `App.tsx` (before registering your component):

```ts
import { 
  setJSExceptionHandler, 
  setNativeExceptionHandler 
} from 'react-native-global-exception-handler';

// Handle JavaScript exceptions
setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error, isFatal);
  // Send to error monitoring service
}, true); // Enable in dev mode

// Handle native exceptions
setNativeExceptionHandler((errorString) => {
  console.log('Native Exception:', errorString);
  // Send to error monitoring service
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false
});
```

## What You Get

- **JavaScript Exception Handling**: Catch all unhandled JS errors with `setJSExceptionHandler`
- **Native Crash Handling**: Catch native crashes (iOS/Android) with `setNativeExceptionHandler`
- **Testing Tools**: Simulate crashes for testing with `simulateNativeCrash`
- **TypeScript Support**: Fully typed APIs

See the [Installation](./installation) and [Usage](./usage) pages for more detail.
