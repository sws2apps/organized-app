import { IconSend } from '@components/icons';
import IconLoading from '@components/icon_loading';
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
