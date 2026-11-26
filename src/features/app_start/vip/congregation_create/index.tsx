import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useCongregationCreate from './useCongregationCreate';
import PageHeader from '@features/app_start/shared/page_header';
import Stepper from '@components/stepper';

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
      <PageHeader title={t('tr_createCongregation')} />

      <Stepper
        steps={steps.map((step) => step.label)}
        activeStep={currentStep}
        sx={{ marginBottom: '32px', marginTop: '-8px' }}
      />

      {steps[currentStep].Component}
    </Box>
  );
};

export default CongregationCreate;
