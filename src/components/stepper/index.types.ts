import { SxProps, Theme } from '@mui/material';

export type StepperProps = {
  /**
   * Label of each step, in order.
   */
  steps: string[];

  /**
   * Index of the step currently being filled in.
   */
  activeStep: number;

  sx?: SxProps<Theme>;
};
