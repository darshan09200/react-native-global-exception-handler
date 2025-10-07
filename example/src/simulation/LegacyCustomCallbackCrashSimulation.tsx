import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

import { ENABLE_DEV_EXCEPTION_HANDLER, FORCE_APP_QUIT } from '../defines';
import Button from '../components/Button';
import { HandlerName, type SimulationComponentProps } from '../types';
import { useEffect } from 'react';
import { jsExceptionHandler, nativeExceptionHandler } from '../utils';

const LegacyCustomCallbackCrashSimulation = ({
  handlerName,
  setHandlerName,
}: SimulationComponentProps) => {
  const onPress = () => {
    // JS uncaught handler (RedBox suppressed only when ENABLE_DEV_EXCEPTION_HANDLER === true)
    setJSExceptionHandler(jsExceptionHandler, ENABLE_DEV_EXCEPTION_HANDLER);

    // Install native handlers exactly once
    setNativeExceptionHandler(nativeExceptionHandler, FORCE_APP_QUIT, true);

    setHandlerName(HandlerName.legacyCustomCallback);
    console.log('Exception handlers set');
  };

  useEffect(() => {
    if (handlerName === HandlerName.legacyCustomCallback) onPress();
  }, []);

  return (
    <Button
      label="Legacy Custom Callback Exception Handler"
      onPress={onPress}
    />
  );
};

export default LegacyCustomCallbackCrashSimulation;
