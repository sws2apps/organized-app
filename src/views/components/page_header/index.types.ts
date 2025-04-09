import { ReactNode } from 'react';

export type PageHeaderType = {
  title: string;
  icon?: ReactNode;
  name: string;
  backgroundColor?: string;
  paintNameOnly?: boolean;
  fixed?: boolean;
};
