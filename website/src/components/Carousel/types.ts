import type { ReactNode } from 'react';

export type Slide = {
  title: string;
  id: string;
  content: ReactNode;
  tab?: (
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    selected: boolean
  ) => ReactNode;
};
