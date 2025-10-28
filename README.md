# react-native-global-exception-handler

[![npm version](https://img.shields.io/npm/v/react-native-global-exception-handler.svg?style=flat)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![npm downloads](https://img.shields.io/npm/dm/react-native-global-exception-handler.svg?style=flat)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![License: MIT](https://img.shields.io/github/license/darshan09200/react-native-global-exception-handler?color=green&style=flat)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/darshan09200/react-native-global-exception-handler/pulls)
[![Documentation](https://img.shields.io/badge/docs-online-blue.svg?style=flat)](https://geh.darshan09200.dev/)

A modern React Native library for global error handling (JavaScript + native) with TurboModules support and cross-platform compatibility.

> 🎬 **[See live demos](https://geh.darshan09200.dev/#demo)** of iOS and Android crash handling in action!

## Key Features

- 🔥 **Modern Architecture**: Built with TurboModules for React Native 0.68+
- 📱 **Cross-Platform**: Full iOS and Android support
- 🎯 **Dual Exception Handling**: Catches both JS and native exceptions
- 🔧 **Highly Customizable**: Configurable options for different platforms
- 🚀 **Crash Simulation**: Built-in crash testing for development
- 🎨 **Custom Error UI**: Platform-specific error screens with restart functionality
- ⚡ **TypeScript Support**: Full TypeScript definitions included

## Why

In React Native apps, uncaught exceptions behave differently based on the environment:

- **In DEV mode**: You get a helpful Red Screen error showing the stack trace
- **In production (bundled) mode**: The app simply **quits without any message** 😱

This creates a poor user experience where users don't know:

- What went wrong
- Whether they should restart the app
- If their data was saved

This library solves this by:

1. **Catching unhandled exceptions** before the app crashes
2. **Allowing you to show a graceful error message** to users
3. **Enabling error reporting** to your development team
4. **Providing restart capabilities** for recovery

## Documentation

[**📚 View Full Documentation**](https://geh.darshan09200.dev/)

### Quick Links

- [Getting Started](https://geh.darshan09200.dev/docs/getting-started) - Installation and setup
- [Usage Guide](https://geh.darshan09200.dev/docs/usage/usage) - JS exception handling
- [Native Crash Handling](https://geh.darshan09200.dev/docs/usage/native-crash-handling) - Platform-specific native handlers
- [API Reference](https://geh.darshan09200.dev/docs/api) - Complete API documentation
- [Testing & Simulation](https://geh.darshan09200.dev/docs/advanced/testing) - simulateNativeCrash and testing
- [Analytics Integration](https://geh.darshan09200.dev/docs/examples/analytics-integration) - Sentry, Crashlytics, custom services
- [Customization](https://geh.darshan09200.dev/docs/advanced/customization) - Custom error screens
- [Troubleshooting](https://geh.darshan09200.dev/docs/troubleshooting) - Common issues and solutions
- [Migration Guide](https://geh.darshan09200.dev/docs/migration/migration) - From react-native-exception-handler

## Installation

```sh
npm install react-native-global-exception-handler
# or
yarn add react-native-global-exception-handler
```

> Requires React Native 0.68+ (TurboModules & auto-linking)

### Architecture Support

Works with both:

- **Legacy Architecture** (Old Architecture)
- **New Architecture** (TurboModules + Fabric)

No additional configuration needed; the correct bindings are auto-selected at build time.

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
  true // allowedInDevMode: true = enable in dev (shows instead of RedBox)
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
    forceAppToQuit: true,              // Android: Force app to quit after error (default: true)
    callPreviouslyDefinedHandler: false // Call previous exception handler (default: false)
  }
);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Credits & Attribution

This project is inspired by the original work in [react-native-exception-handler](https://github.com/a7ul/react-native-exception-handler) created by its original authors and community of contributors. Many foundational ideas (global JS/native handler approach, restart patterns, native popup customization) originated there.

## License

MIT

---

Made with ❤️ for the React Native community
