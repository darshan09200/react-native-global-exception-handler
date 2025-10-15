import { NativeModules } from 'react-native';
import TurboGlobalExceptionHandler, {
  type Spec,
} from './NativeGlobalExceptionHandler';

function validateTurboModule<T>(module: T | null): T | null {
  // Only attempt if Turbo infra is present
  if ((global as any).__turboModuleProxy == null) return null;

  if (module == null) {
    // Make failures loud in dev
    throw new Error(
      'GlobalExceptionHandler native module not found (Turbo). ' +
        "If you're on new arch, ensure the pod is installed and you've rebuilt the app."
    );
  }

  return module;
}

const turbo = validateTurboModule<Spec>(TurboGlobalExceptionHandler);
const classic = (NativeModules as any).GlobalExceptionHandler as
  | Spec
  | undefined;

if (!turbo && !classic) {
  // Make failures loud in dev
  throw new Error(
    'GlobalExceptionHandler native module not found (neither Turbo nor classic). ' +
      "If you're on old arch, ensure RCT_EXPORT_MODULE is compiled and the pod is installed."
  );
}

const GlobalExceptionHandler: Spec = turbo ?? classic!;

export default GlobalExceptionHandler;
