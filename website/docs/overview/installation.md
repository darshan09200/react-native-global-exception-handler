---
id: installation
sidebar_position: 2
title: Installation
description: Installation and platform-specific setup instructions for react-native-global-exception-handler (iOS, Android, and TypeScript guidance).
keywords:
  - installation
  - setup
  - ios
  - android
  - pods
  - gradle
---

## Peer Dependencies

Ensure you have a recent version of React Native (0.68+) and TypeScript if using types.

## Architecture Support

This library supports both the legacy (Old Architecture) and the New Architecture (TurboModules + Fabric) of React Native:

- Works with projects that have **not** enabled the New Architecture (uses the JS runtime and auto-linked native module as usual).
- Fully compatible with the **New Architecture**: the native module is implemented as a TurboModule, and exception handling works across both architectures without extra configuration.

No additional steps are required to enable support; the correct native bindings are auto-selected at build time.

> If you later migrate your app to the New Architecture, you do **not** need to change your exception handler setup—your existing usage continues to work.

## Install Package

```bash npm2yarn
npm install react-native-global-exception-handler
```

## iOS Setup

Run CocoaPods after installation:

```bash
cd ios && pod install
```

No additional manual iOS integration is required.

## Android Setup

The library uses a native module. Gradle should auto-link automatically when you run the app. No manual steps required.

## TypeScript

Types are bundled. Import directly:

```ts
import type { 
  ExceptionHandlerOptions,
  JSExceptionHandler,
  NativeExceptionHandler,
  CrashType
} from 'react-native-global-exception-handler';
```
