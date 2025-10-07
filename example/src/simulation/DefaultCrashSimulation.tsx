import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';

import { ENABLE_DEV_EXCEPTION_HANDLER, FORCE_APP_QUIT } from '../defines';
import Button from '../components/Button';
import { HandlerName, type SimulationComponentProps } from '../types';
import { useEffect } from 'react';

const DefaultCrashSimulation = ({
  handlerName,
  setHandlerName,
}: SimulationComponentProps) => {
  const onPress = () => {
    // JS uncaught handler (RedBox suppressed only when ENABLE_DEV_EXCEPTION_HANDLER === true)
    setJSExceptionHandler(undefined, ENABLE_DEV_EXCEPTION_HANDLER);

    // Install native handlers exactly once
    setNativeExceptionHandler(undefined, {
      forceAppToQuit: FORCE_APP_QUIT,
      callPreviouslyDefinedHandler: true,
    });

    setHandlerName(HandlerName.default);
    console.log('Exception handlers set');
  };

  useEffect(() => {
    if (handlerName === HandlerName.default) onPress();
  }, []);

  return <Button label="Default Exception Handler" onPress={onPress} />;
};

export default DefaultCrashSimulation;
