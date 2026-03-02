# react-native-global-exception-handler

[![npm version](https://img.shields.io/npm/v/react-native-global-exception-handler.svg?style=flat)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![npm downloads](https://img.shields.io/npm/dm/react-native-global-exception-handler.svg?style=flat)](https://www.npmjs.com/package/react-native-global-exception-handler)
[![License: MIT](https://img.shields.io/github/license/darshan09200/react-native-global-exception-handler?color=green&style=flat)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/darshan09200/react-native-global-exception-handler/pulls)
[![Documentation](https://img.shields.io/badge/docs-online-blue.svg?style=flat)](https://geh.darshan09200.dev/)

A modern React Native library for JavaScript and native exception handling, graceful fallback flows, and crash-reporting integrations.

> 🎬 **[See live demos](https://geh.darshan09200.dev/#demo)** of iOS and Android crash handling in action!

## Key Features

- 🔥 **Modern Architecture Support**: Works with both legacy and new architecture React Native projects
- 🎯 **Dual Exception Handling**: Capture uncaught JavaScript exceptions and native crashes in one place
- 🔗 **Chained Native Handlers**: Preserve existing crash flows when another SDK already owns the handler
- 🚀 **Crash Simulation**: Use `simulateNativeCrash` to validate release-mode behavior safely
- 📡 **Reporting Integrations**: Forward events to Sentry, Crashlytics, or your own backend
- ⚡ **TypeScript Support**: Full type definitions for handlers and options

## Why

In React Native apps, uncaught failures behave differently depending on the environment:

- **In DEV mode**: you usually get a helpful Red Screen with a stack trace
- **In production (bundled) mode**: the app can quit or crash with far less context

That makes it harder to answer basic questions:

- What failed?
- Was it a JavaScript exception or a native crash?
- Should the app show fallback UI, restart, or just log the failure?
- Did the crash report actually reach Sentry, Crashlytics, or your own backend?

This package helps by giving you one place to:

1. Register JavaScript and native exception handlers
2. Wire crash reporting to Sentry, Crashlytics, or your own backend
3. Define fallback or restart behavior where the platform allows it
4. Validate native crash behavior before you ship

## Documentation

[**📚 View Full Documentation**](https://geh.darshan09200.dev/)

### Quick Links

- [Getting Started](https://geh.darshan09200.dev/docs/overview/getting-started/) - First install and handler setup
- [Installation](https://geh.darshan09200.dev/docs/overview/installation/) - iOS, Android, and linking checks
- [Basic Usage](https://geh.darshan09200.dev/docs/usage/basic-usage/) - Register JavaScript and native handlers
- [Native Crash Handling](https://geh.darshan09200.dev/docs/usage/native-crash-handling/) - Platform limits and release testing
- [API Reference](https://geh.darshan09200.dev/docs/api/) - Public API and option behavior
- [Testing & Simulation](https://geh.darshan09200.dev/docs/advanced/testing/) - `simulateNativeCrash` and validation
- [Sentry Integration](https://geh.darshan09200.dev/docs/examples/react-native-sentry-integration/) - Forward reports to Sentry
- [Crashlytics Integration](https://geh.darshan09200.dev/docs/examples/react-native-crashlytics-integration/) - Forward reports to Crashlytics
- [Troubleshooting](https://geh.darshan09200.dev/docs/troubleshooting/) - Common setup and release issues
- [Migration Guide](https://geh.darshan09200.dev/docs/migration/migrating-from-react-native-exception-handler/) - Move from `react-native-exception-handler`

### For AI agents and code assistants

- [Machine-readable guide](https://geh.darshan09200.dev/llms.txt) - canonical `llms.txt` entrypoint
- [AI Agents docs page](https://geh.darshan09200.dev/docs/ai-agents/) - task map, caveats, and API-at-a-glance notes

## Installation

```sh
npm install react-native-global-exception-handler
# or
yarn add react-native-global-exception-handler
```

> Requires React Native 0.68+ (TurboModules & auto-linking)

### Architecture Support

Designed to work with both:

- **Legacy Architecture**
- **New Architecture** (TurboModules + Fabric)

No extra setup is usually required beyond installing the package, running pods on iOS, and rebuilding the app.

## Quick Start

### JavaScript Exception Handling

```js
import { setJSExceptionHandler } from 'react-native-global-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('JS Exception:', error);

  if (isFatal) {
    // Show fallback UI or send a fatal report
  } else {
    // Log and continue
  }
});
```

### Native Exception Handling

```js
import { setNativeExceptionHandler } from 'react-native-global-exception-handler';

setNativeExceptionHandler((errorString) => {
  console.log('Native Exception:', errorString);
  // Send to crash reporting service
}, {
  forceAppToQuit: true,
  callPreviouslyDefinedHandler: false,
});
```

For more complete examples, see [Basic Usage](https://geh.darshan09200.dev/docs/usage/basic-usage/), [Native Crash Handling](https://geh.darshan09200.dev/docs/usage/native-crash-handling/), and the [API Reference](https://geh.darshan09200.dev/docs/api/).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Credits & Attribution

This project is inspired by the original work in [react-native-exception-handler](https://github.com/a7ul/react-native-exception-handler) created by its original authors and community of contributors. Many foundational ideas (global JS/native handler approach, restart patterns, native popup customization) originated there.

## License

MIT

---

Made with ❤️ for the React Native community
