import { ReactNode } from 'react';
import { CustomClassName } from '@definition/app';

export type DetailRowProps = {
  icon?: ReactNode;
  label?: string;
  children: ReactNode;
  className?: CustomClassName;
  color?: string;
  preserveWhitespace?: boolean;
};
