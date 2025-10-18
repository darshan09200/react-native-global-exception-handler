# react-native-global-exception-handler

[![npm version](https://img.shields.io/npm/v/react-native-global-exception-handler.svg)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![npm downloads](https://img.shields.io/npm/dm/react-native-global-exception-handler.svg)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![License: MIT](https://img.shields.io/github/license/darshan09200/react-native-global-exception-handler?color=green)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/darshan09200/react-native-global-exception-handler/pulls)

A modern React Native library for global error handling (JavaScript + native) with TurboModules support and cross-platform compatibility.

## Key Features

- 🔥 **Modern Architecture**: Built with TurboModules for React Native 0.68+
- 📱 **Cross-Platform**: Full iOS and Android support
- 🎯 **Dual Exception Handling**: Catches both JS and native exceptions
- 🔧 **Highly Customizable**: Configurable options for different platforms
- 🚀 **Crash Simulation**: Built-in crash testing for development
- 🎨 **Custom Error UI**: Platform-specific error screens with restart functionality
- ⚡ **TypeScript Support**: Full TypeScript definitions included

## Why

Without a global handler, production native crashes often terminate silently and JS fatal errors close the app abruptly. This library lets you intercept them, show a fallback UI, and optionally report & recover.

## Demo

| iOS (demo) | Android (demo) |
| ---------- | -------------- |
| ![iOS demo](./docs/assets/iOS_demo.png) | ![Android demo](./docs/assets/android_demo.png) |

## Installation

```sh
npm install react-native-global-exception-handler
# or
yarn add react-native-global-exception-handler
```

> Requires React Native 0.68+ (TurboModules & auto-linking).

## Quick Start

### JS Exception Handling

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
```

## Documentation

Full docs live at: <https://darshan09200.github.io/react-native-global-exception-handler/>

- Getting Started
- Installation
- Usage
- Native Crash Handling
- API Reference
- Testing & Simulation
- Analytics Integration
- Troubleshooting
- Migration Guide

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Credits & Attribution

This project is inspired by the original work in [react-native-exception-handler](https://github.com/a7ul/react-native-exception-handler) created by its original authors and community of contributors. Many foundational ideas (global JS/native handler approach, restart patterns, native popup customization) originated there.

## License

MIT

---

Made with ❤️ for the React Native community
