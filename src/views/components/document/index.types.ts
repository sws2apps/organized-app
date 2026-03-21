import { ReactNode } from 'react';

// DocumentType name is taken by default react
export type PDFDocumentType = {
  title: string;
  children: ReactNode;
  lang: string;
};
