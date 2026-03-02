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

This is where the library starts feeling real. The usage guides show how to wire JavaScript and native handlers, where the two crash paths differ, and which platform limits matter before you ship a release build.

## Start here

- [Basic Usage](./basic-usage.md): register JavaScript and native handlers in your entry point.
- [Native Crash Handling](./native-crash-handling.md): understand what iOS and Android can do after a native failure.

## Recommended path

1. Follow [Installation](../overview/installation.md) if the package is not in your app yet.
2. Copy the handler setup from [Basic Usage](./basic-usage.md).
3. Review [Native Crash Handling](./native-crash-handling.md) before shipping release builds.
4. Use the [API Reference](../api.md) for signatures, types, and defaults.

## Ready for more?

If you want crash simulation, custom native screens, or reporting integrations, jump next to [Advanced](../advanced/) or [Examples](../examples/).
