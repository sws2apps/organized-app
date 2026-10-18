import { BoxProps } from '@mui/material';
import { AssignmentHistoryType } from '@definition/schedules';

export type LocationBadgesProps = BoxProps & {
  history: AssignmentHistoryType;
};
