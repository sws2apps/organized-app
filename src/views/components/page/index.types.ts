import { ReactNode } from 'react';

export type PageType = {
  children: ReactNode;
  orientation?: 'portrait' | 'landscape';
};
