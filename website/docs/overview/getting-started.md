---
id: getting-started
sidebar_position: 1
title: Getting Started
description: Quickstart guide to install and set up react-native-global-exception-handler to capture JS and native crashes in your React Native app.
keywords:
  - getting started
  - quick start
  - setup
  - react-native
  - installation
---

Welcome to `react-native-global-exception-handler`.

This library lets you capture uncaught JavaScript exceptions and native crashes in React Native apps and gives you a single place to report them (e.g. Sentry, Crashlytics, your own backend) and perform graceful recovery.

## Why Do You Need This?

In React Native apps, uncaught exceptions behave differently based on the environment:

- **In DEV mode**: You get a helpful Red Screen error showing the stack trace
- **In production (bundled) mode**: The app simply **quits without any message** 😱

This creates a poor user experience. Users don't know:

- What went wrong
- Whether they should restart the app
- If their data was saved

This library solves this by:

1. **Catching unhandled exceptions** before the app crashes
2. **Allowing you to show a graceful error message** to users
3. **Enabling error reporting** to your development team
4. **Providing restart capabilities** for recovery

## Installation

```bash npm2yarn
npm install react-native-global-exception-handler
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

See the [Installation](./installation.md) and [Usage](../usage/usage.md) pages for more detail.
