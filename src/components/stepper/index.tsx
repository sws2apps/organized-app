import { Step, StepLabel, Stepper as MUIStepper } from '@mui/material';
import Typography from '@components/typography';
import { StepperProps } from './index.types';

const Stepper = ({ steps, activeStep, sx }: StepperProps) => (
  <MUIStepper activeStep={activeStep} alternativeLabel sx={sx}>
    {steps.map((label, index) => {
      const done = index <= activeStep;

      return (
        <Step
          key={label}
          sx={{
            '.MuiStepIcon-root': {
              '&.Mui-active': { color: 'unset' },
              color: done
                ? 'var(--accent-main) !important'
                : 'var(--accent-150) !important',
            },
            '.MuiStepIcon-text': {
              fill: done ? 'var(--always-white)' : 'var(--accent-dark)',
            },
          }}
        >
          <StepLabel>
            <Typography
              className="label-small-medium"
              color={done ? 'var(--accent-dark)' : 'var(--accent-400)'}
            >
              {label}
            </Typography>
          </StepLabel>
        </Step>
      );
    })}
  </MUIStepper>
);

export default Stepper;
