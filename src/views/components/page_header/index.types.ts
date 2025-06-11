import { JSX } from 'react';

export type PageHeaderProps = {
  variant: 'main' | 'secondary';
  icon?: JSX.Element;
  title?: string;
  fixed?: boolean;
  congregationName?: string;
  backgroundColor?: string;
};
