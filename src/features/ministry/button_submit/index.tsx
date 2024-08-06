import { IconSend } from '@components/icons';
import Button from '@components/button';
import useAppTranslation from '@hooks/useAppTranslation';
import useButtonActions from './useButtonActions';

const SubmitApplicationButton = () => {
  const { t } = useAppTranslation();

  const { handleSubmitApplication } = useButtonActions();

  return (
    <Button
      variant="main"
      startIcon={<IconSend />}
      onClick={handleSubmitApplication}
    >
      {t('tr_submitApplication')}
    </Button>
  );
};

export default SubmitApplicationButton;
