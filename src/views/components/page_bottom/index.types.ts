import { ReactNode } from 'react';

export type PageBottomProps = {
  qrCode: ReactNode;
  created: Date;
  fixed?: boolean;
  shortDateFormat: string;
};
