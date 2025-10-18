---
id: installation
sidebar_position: 2
title: Installation
---

## Peer Dependencies

Ensure you have a recent version of React Native (0.71+) and TypeScript if using types.

## Install Package

### Using npm

```bash
npm install react-native-global-exception-handler
```

### Using yarn

```bash
yarn add react-native-global-exception-handler
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
import type { GlobalExceptionHandlerOptions } from 'react-native-global-exception-handler';
```
