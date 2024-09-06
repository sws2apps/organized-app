import { ReactNode } from 'react';
import {
  AccordionDetailsProps,
  AccordionProps as MUIAccordionProps,
} from '@mui/material';
import { TypographyTypeProps } from '@components/typography/index.types';

export type AccordionProps = Omit<
  MUIAccordionProps,
  'onChange' | 'children'
> & {
  id: string;
  onChange?: (value: string | false) => void;
  label: string;
  summaryProps?: TypographyTypeProps;
  detailsProps?: AccordionDetailsProps;
  children?: ReactNode;
};
