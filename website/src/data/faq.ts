export type FAQItem = {
  id?: string;
  question: string;
  answer: string;
  // optional list of doc ids where this FAQ applies; if omitted, it applies globally
  docs?: string[];
};

export const faqItems: FAQItem[] = [
  {
    id: 'cocoapods-install',
    question: 'How do I fix CocoaPods installation errors for iOS?',
    answer: `Error:\n\n[!] CocoaPods could not find compatible versions for pod "GlobalExceptionHandler"\n\nSolution:\n\n1. Update CocoaPods:\nsudo gem install cocoapods\n\n2. Clean and reinstall:\ncd ios\nrm -rf Pods Podfile.lock\npod deintegrate\npod install\ncd ..\n\nSee the Troubleshooting doc for exact commands and additional context.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'android-build-fails',
    question:
      'What should I do when Android build fails with dependency errors?',
    answer: `Error example:\n\nCould not determine the dependencies of task ':app:compileDebugJavaWithJavac'\n\nSolution:\n\n1. Ensure your android/build.gradle has the correct Kotlin version, e.g.:\nbuildscript {\n  ext {\n    kotlinVersion = "1.8.0"\n  }\n}\n\n2. Clean gradle cache and rebuild:\ncd android\n./gradlew clean\n./gradlew cleanBuildCache\ncd ..\n\nThen re-run your build. See the Troubleshooting doc for full steps.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'simulate-native-crash',
    question: 'How can I simulate a native crash for testing?',
    answer: `Steps:\n\n1. Ensure you're on a supported platform (iOS or Android) and running on a real device or supported simulator.\n2. Call the provided simulation API (example):\nimport { simulateNativeCrash } from 'react-native-global-exception-handler';\n\nsimulateNativeCrash('nsexception');\n\n3. Guard simulation code from production using __DEV__:\nif (__DEV__) {\n  global.simulateCrash = () => simulateNativeCrash('nsexception');\n}\n\nVerify the crash type is valid for your platform. If the simulation has no effect, confirm you are not running in an unsupported environment (e.g., web).`,
    docs: ['troubleshooting'],
  },
  {
    id: 'simulate-crash-not-working',
    question: 'simulateNativeCrash has no effect — how do I fix it?',
    answer: `If simulation doesn't work:\n\n1. Ensure you're on iOS/Android (not web).\n2. Verify Platform.OS and only call simulation on supported platforms. Example:\nimport { Platform } from 'react-native';\n\nif (Platform.OS === 'ios' || Platform.OS === 'android') {\n  simulateNativeCrash('nsexception');\n} else {\n  console.log('Not supported on this platform');\n}\n\n3. Confirm the crash type is valid for the platform.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'handler-dev-mode',
    question: 'How can I enable JS exception handler in development?',
    answer: `To enable the JS exception handler in development pass true as the second parameter:\nsetJSExceptionHandler((error, isFatal) => {\n  // Your handler\n}, true); // ← enable in dev mode\n\nNote: Native handlers may still be affected by debug tooling; test native handlers in release builds when possible.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'native-handler-dev',
    question: 'Why does the native handler not trigger in development?',
    answer: `In debug mode React Native's debug infrastructure can interfere with native exception handling. Test native handlers in release builds where debug tooling won't intercept uncaught exceptions.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'app-restart-after-crash',
    question:
      "Why doesn't the app restart after a crash and how can I provide restart functionality?",
    answer: `On Android, ensure you pass forceAppToQuit for proper cleanup:\nsetNativeExceptionHandler((errorString) => {\n  // Handle error\n}, {\n  forceAppToQuit: true // Required for proper cleanup\n});\n\nOn iOS there is no programmatic restart — show a custom error screen and instruct the user to restart the app.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'force-app-to-quit-false',
    question: 'When should I set `forceAppToQuit` to false?',
    answer: `Use cases for forceAppToQuit: false:\n\n- When using navigation libraries (e.g., react-native-navigation) that recreate the app stack and can handle recovery.\n- When you have custom native recovery logic and want the app to attempt recovery instead of forcing a quit.\n\nExample:\nsetNativeExceptionHandler((errorString) => {\n  console.log('Native error:', errorString);\n  reportToAnalytics(errorString);\n}, {\n  forceAppToQuit: false,\n  callPreviouslyDefinedHandler: true\n});\n\nNote: In many cases forceAppToQuit: true is safer for clean crash handling.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'errors-not-reaching-analytics',
    question:
      'Errors are captured but not sent to my analytics service — what now?',
    answer: `Common fixes:\n\n1. Check network connectivity from within your handler.\n2. Queue errors locally for retry using AsyncStorage. Example:\nimport AsyncStorage from '@react-native-async-storage/async-storage';\n\nconst queueError = async (error) => {\n  const queue = await AsyncStorage.getItem('error_queue');\n  const errors = queue ? JSON.parse(queue) : [];\n  errors.push(error);\n  await AsyncStorage.setItem('error_queue', JSON.stringify(errors));\n};\n\nsetJSExceptionHandler((error, isFatal) => {\n  queueError({ error, isFatal });\n}, true);\n\nThis ensures errors persist until they can be sent.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'performance-sluggish-handler',
    question:
      'Why does app performance degrade after setting exception handlers?',
    answer: `Keep handlers lightweight. Avoid heavy synchronous work that blocks the event loop.\n\nBad example (heavy synchronous work):\n// ❌ Bad\nsetJSExceptionHandler((error, isFatal) => {\n  const largeData = processHugeDataset();\n  sendToServer(largeData);\n}, true);\n\nGood example (deferred async work):\n// ✅ Good\nsetJSExceptionHandler((error, isFatal) => {\n  setTimeout(() => {\n    sendToServer(error);\n  }, 0);\n}, true);`,
    docs: ['troubleshooting'],
  },
  {
    id: 'memory-leaks-from-handlers',
    question: 'How do I prevent memory leaks caused by error handlers?',
    answer: `Avoid capturing large variables in closures that handlers use.\n\nBad example (captures largeData):\nlet largeData = /* ... */;\nsetJSExceptionHandler((error, isFatal) => {\n  console.log(largeData); // Keeps largeData in memory\n}, true);\n\nBetter approach: fetch fresh data when needed inside the handler so large references are not retained.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'turbomodule-not-found',
    question: "Why am I seeing 'TurboModuleRegistry.getEnforcing' errors?",
    answer: `This error is usually specific to the React Native new architecture (TurboModules).\n\nExample:\nTurboModuleRegistry.getEnforcing called for module 'GlobalExceptionHandler' but it is not registered\n\nSolution:\n\n1. Ensure you're using React Native 0.68 or higher.\n2. Clear Metro cache and restart:\nnpx react-native start --reset-cache\n3. Clean and rebuild (iOS/Android):\n# iOS\ncd ios && rm -rf Pods && pod install && cd ..\nnpx react-native run-ios\n\n# Android\ncd android && ./gradlew clean && cd ..\nnpx react-native run-android\n`,
    docs: ['troubleshooting'],
  },
  {
    id: 'typescript-handler-types',
    question:
      'How can I fix TypeScript type errors when assigning handler functions?',
    answer: `Example:\nimport {\n  setJSExceptionHandler,\n  type JSExceptionHandler\n} from 'react-native-global-exception-handler';\n\nconst handler: JSExceptionHandler = (error, isFatal) => {\n  console.log(error);\n};\n\nsetJSExceptionHandler(handler, true);\n\nFor native options types:\nimport {\n  setNativeExceptionHandler,\n  type ExceptionHandlerOptions\n} from 'react-native-global-exception-handler';\n\nconst options: ExceptionHandlerOptions = {\n  forceAppToQuit: true,\n  callPreviouslyDefinedHandler: false\n};`,
    docs: ['troubleshooting'],
  },
  {
    id: 'react-native-version-mismatch',
    question:
      'What if my React Native version is incompatible with this library?',
    answer: `This library requires React Native 0.68+. If you're on an older RN version you can:\n\n1. Upgrade React Native:\nnpx react-native upgrade\n\n2. Or use an older compatible library:\nnpm install react-native-exception-handler\n`,
    docs: ['troubleshooting'],
  },
  {
    id: 'hermes-not-enabled',
    question: 'Some features require Hermes — how do I enable it?',
    answer: `Enable Hermes in your app configuration.\n\niOS (Podfile):\nuse_react_native!(\n  :path => config[:reactNativePath],\n  :hermes_enabled => true\n)\n\nAndroid (android/app/build.gradle):\nproject.ext.react = [\n    enableHermes: true\n]\n\nAfter enabling, reinstall pods and rebuild.`,
    docs: ['troubleshooting'],
  },
  {
    id: 'getting-more-help',
    question:
      'How do I get more help if the troubleshooting steps do not fix my issue?',
    answer: `Steps to get help:\n\n1. Check existing issues on GitHub: https://github.com/darshan09200/react-native-global-exception-handler/issues\n2. Create a new issue including:\n   - React Native version\n   - Platform (iOS/Android)\n   - Error message\n   - Minimal reproduction code\n3. Enable verbose logging for troubleshooting:\nsetJSExceptionHandler((error, isFatal) => {\n  console.log('Error details:', {\n    name: error.name,\n    message: error.message,\n    stack: error.stack,\n    isFatal\n  });\n}, true);\n`,
    docs: ['troubleshooting'],
  },
];
