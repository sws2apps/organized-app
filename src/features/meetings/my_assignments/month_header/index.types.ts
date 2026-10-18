import { BoxProps } from '@mui/material';
import { AssignmentsMonth } from '../indextypes';

export type MonthHeaderProps = BoxProps & {
  month: AssignmentsMonth;
};
