import { useAppTranslation } from '@hooks/index';
import useInitialSetup from './useInitialSetup';
import BasicSettings from './basic_settings';
import Dialog from '@components/dialog';
import PersonRecord from './person_record';
import Typography from '@components/typography';

const InitialSetup = () => {
  const { t } = useAppTranslation();

  const { handleClose, open, currentStep, handleMoveStep, handleBackStep } =
    useInitialSetup();

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: '24px' }}>
      <Typography className="h2">
        {t('tr_initialOrganizedSetupTitle')}
      </Typography>

      {currentStep === 1 && <BasicSettings onMove={handleMoveStep} />}
      {currentStep === 2 && <PersonRecord onPrevious={handleBackStep} />}
    </Dialog>
  );
};

export default InitialSetup;
