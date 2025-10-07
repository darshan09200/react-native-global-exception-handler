import { Alert } from 'react-native';

export const jsExceptionHandler = (error: Error, isFatal: boolean) => {
  // In production you’d forward to Sentry/Bugsnag then show your own UI
  Alert.alert(
    isFatal ? 'Fatal JS Error' : 'JS Error',
    error?.message ?? String(error)
  );
};

export const nativeExceptionHandler = (exceptionString: string) => {
  // This may (or may not) run right before termination; don’t rely on it for UX.
  console.log('Native Exception (pre-terminate):', exceptionString);
};
