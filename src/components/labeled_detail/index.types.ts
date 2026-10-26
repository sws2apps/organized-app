import { ReactNode } from 'react';
import { CustomClassName } from '@definition/app';

export type LabeledDetailProps = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  valueClassName?: CustomClassName;
};
