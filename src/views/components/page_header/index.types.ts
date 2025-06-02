import { JSX } from 'react';

export type PageHeaderType = {
  variant: 'main' | 'secondary';
  icon?: JSX.Element;
  title?: string;
  fixed?: boolean;
  congregationName?: string;
  backgroundColor?: string;
};
