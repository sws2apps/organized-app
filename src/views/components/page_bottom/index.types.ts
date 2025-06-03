import { ReactNode } from 'react';

export type PageBottom = {
  qrCode: ReactNode;
  created: Date;
  fixed?: boolean;
  shortDateFormat: string;
};
