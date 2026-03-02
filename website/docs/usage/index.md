---
id: usage-overview
title: Usage Guide
sidebar_label: Overview
slug: /usage/
sidebar_position: 1
description: Learn how to configure react-native-global-exception-handler, choose between JavaScript and native crash flows, and move from install to production-ready usage.
keywords:
  - react native exception handler usage
  - react native crash handler
  - react native global error handler
  - native crash handling
  - javascript exception handler
---

Use this section when you need to configure `react-native-global-exception-handler` in a real React Native app. These guides explain the difference between JavaScript and native crashes, show the recommended handler setup, and document the platform limits that matter in release builds.

## Start here

- [Basic Usage](./basic-usage.md): register JavaScript and native handlers in your entry point.
- [Native Crash Handling](./native-crash-handling.md): understand what iOS and Android can do after a native failure.

## Recommended path

1. Follow [Installation](../overview/installation.md) if the package is not in your app yet.
2. Copy the handler setup from [Basic Usage](./basic-usage.md).
3. Review [Native Crash Handling](./native-crash-handling.md) before shipping release builds.
4. Use the [API Reference](../api.md) for signatures, types, and defaults.

## Need more than the basics?

If you need testing, custom crash screens, or analytics integrations, continue into the [Advanced](../advanced/) and [Examples](../examples/) sections.
