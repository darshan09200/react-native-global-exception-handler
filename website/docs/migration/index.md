---
id: migration-overview
title: Migration Guides
sidebar_label: Overview
slug: /migration/
sidebar_position: 1
description: Migration guides for teams moving from react-native-exception-handler to react-native-global-exception-handler, with API differences, replacement examples, and compatibility notes.
keywords:
  - migrate from react-native-exception-handler
  - react-native-exception-handler alternative
  - react native exception handler migration
  - react-native-global-exception-handler comparison
---

This section is for teams moving off older crash-handling packages or deciding whether the switch is worth it. The guides focus on the practical questions: what changes in the API, what stays familiar, and what you need to retest before the migration is done.

## Start with these

- [Migrating from react-native-exception-handler](./migrating-from-react-native-exception-handler.md)
- [react-native-exception-handler vs react-native-global-exception-handler](./react-native-exception-handler-vs-react-native-global-exception-handler.md)

## Migration workflow

1. Compare the old and new package behavior.
2. Replace imports and native handler signatures.
3. Verify release-build crash handling on both platforms.
4. Reconnect your analytics provider or restart flow using the updated docs and examples.
