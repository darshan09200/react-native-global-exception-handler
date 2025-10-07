export type HandlerName = (typeof HandlerName)[keyof typeof HandlerName];

export const HandlerName = {
  default: 'default' as const,
  customCallback: 'customCallback' as const,

  legacyDefault: 'legacyDefault' as const,
  legacyCustomCallback: 'legacyCustomCallback' as const,
} as const;

export type SimulationComponentProps = {
  handlerName: HandlerName;
  setHandlerName: (name: HandlerName) => void;
};
