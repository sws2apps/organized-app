import {
  Button,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import useActionSteps from './useActionSteps';
import useMigrate from '../hooks/useMigrate';

const ActionSteps = () => {
  const { handleOpenApp } = useMigrate();

  const { currentStep, steps } = useActionSteps();

  return (
    <Stack spacing="24px">
      <Stepper activeStep={currentStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>{step.Component}</StepContent>
          </Step>
        ))}
      </Stepper>

      {currentStep === steps.length && (
        <Stack spacing="12px">
          <Typography>
            Congratulations! You have completed the migration and you can now
            open the new Organized app.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenApp}
            endIcon={<OpenInNew />}
          >
            Open Organized
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ActionSteps;
