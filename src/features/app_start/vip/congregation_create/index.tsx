import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useCongregationCreate from './useCongregationCreate';
import PageHeader from '@features/app_start/shared/page_header';
import Typography from '@components/typography';

const CongregationCreate = () => {
  const { t } = useAppTranslation();

  const { steps, currentStep } = useCongregationCreate();

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <PageHeader title={t('tr_createCongregationAccount')} />

      <Stepper
        activeStep={currentStep}
        alternativeLabel
        sx={{ marginBottom: '32px', marginTop: '-8px' }}
      >
        {steps.map((step, index) => (
          <Step
            key={step.label}
            sx={{
              '.MuiStepIcon-root': {
                '&.Mui-active': { color: 'unset' },
                color:
                  index <= currentStep
                    ? 'var(--accent-main) !important'
                    : 'var(--accent-150) !important',
              },
              '.MuiStepIcon-text': {
                fill:
                  index <= currentStep
                    ? 'var(--always-white)'
                    : 'var(--accent-dark)',
              },
            }}
          >
            <StepLabel>
              <Typography
                className="label-small-medium"
                color={
                  index <= currentStep
                    ? 'var(--accent-dark)'
                    : 'var(--accent-400)'
                }
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {steps[currentStep].Component}
    </Box>
  );
};

export default CongregationCreate;
