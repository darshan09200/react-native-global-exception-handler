import CustomCallbackCrashSimulation from '../simulation/CustomCallbackCrashSimulation';
import DefaultCrashSimulation from '../simulation/DefaultCrashSimulation';
import LegacyCustomCallbackCrashSimulation from '../simulation/LegacyCustomCallbackCrashSimulation';
import LegacyDefaultCrashSimulation from '../simulation/LegacyDefaultCrashSimulation';
import { HandlerName, type SimulationComponentProps } from '../types';

export const ENABLE_DEV_EXCEPTION_HANDLER = false;
export const FORCE_APP_QUIT = true;

export const SimulationsMapping: Record<
  HandlerName,
  {
    name: HandlerName;
    component: React.FC<SimulationComponentProps>;
  }
> = {
  [HandlerName.default]: {
    name: HandlerName.default,
    component: DefaultCrashSimulation,
  },
  [HandlerName.customCallback]: {
    name: HandlerName.customCallback,
    component: CustomCallbackCrashSimulation,
  },
  [HandlerName.legacyDefault]: {
    name: HandlerName.legacyDefault,
    component: LegacyDefaultCrashSimulation,
  },
  [HandlerName.legacyCustomCallback]: {
    name: HandlerName.legacyCustomCallback,
    component: LegacyCustomCallbackCrashSimulation,
  },
};
