import { ReactNode } from 'react';
import {
  AccordionDetailsProps,
  AccordionSummaryProps,
  AccordionProps as MUIAccordionProps,
} from '@mui/material';
import { TypographyTypeProps } from '@components/typography/index.types';

export type AccordionProps = Omit<
  MUIAccordionProps,
  'onChange' | 'children'
> & {
  id: string;
  onChange?: (value: string | false) => void;
  label: string | ReactNode;
  summaryProps?: AccordionSummaryProps;
  summaryTextProps?: TypographyTypeProps;
  detailsProps?: AccordionDetailsProps;
  children?: ReactNode;
};
