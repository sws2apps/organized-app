import { IconLoading, IconSend } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useSubmitApplication from './useSubmitApplication';
import Button from '@components/button';

const SubmitApplication = () => {
  const { t } = useAppTranslation();

  const { disabled, handleSubmit, isProcessing } = useSubmitApplication();

  return (
    <Button
      variant="main"
      startIcon={isProcessing ? <IconLoading /> : <IconSend />}
      disabled={disabled}
      onClick={handleSubmit}
    >
      {t('tr_btnSubmitApplication')}
    </Button>
  );
};

export default SubmitApplication;
