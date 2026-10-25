import { ReactNode } from 'react';

export type LabeledDetailProps = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
};
