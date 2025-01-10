import { IconSend } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useSubmitApplication from './useSubmitApplication';
import Button from '@components/button';
import WaitingLoader from '@components/waiting_loader';

const SubmitApplication = () => {
  const { t } = useAppTranslation();

  const { disabled, handleSubmit, isProcessing } = useSubmitApplication();

  return (
    <Button
      variant="main"
      startIcon={
        isProcessing ? (
          <WaitingLoader size={22} variant="standard" />
        ) : (
          <IconSend />
        )
      }
      disabled={disabled}
      onClick={handleSubmit}
    >
      {t('tr_btnSubmitApplication')}
    </Button>
  );
};

export default SubmitApplication;
