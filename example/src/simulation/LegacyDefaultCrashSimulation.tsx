import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-global-exception-handler';
import { ENABLE_DEV_EXCEPTION_HANDLER, FORCE_APP_QUIT } from '../defines';
import Button from '../components/Button';
import { HandlerName, type SimulationComponentProps } from '../types';
import { useEffect } from 'react';

const LegacyDefaultCrashSimulation = ({
  handlerName,
  setHandlerName,
}: SimulationComponentProps) => {
  const onPress = () => {
    // JS uncaught handler (RedBox suppressed only when ENABLE_DEV_EXCEPTION_HANDLER === true)
    setJSExceptionHandler(undefined, ENABLE_DEV_EXCEPTION_HANDLER);

    // Install native handlers exactly once
    setNativeExceptionHandler(undefined, FORCE_APP_QUIT, true);

    setHandlerName(HandlerName.legacyDefault);
    console.log('Legacy default exception handlers set');
  };

  useEffect(() => {
    if (handlerName === HandlerName.legacyDefault) onPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Button label="Legacy Default Exception Handler" onPress={onPress} />;
};

export default LegacyDefaultCrashSimulation;
