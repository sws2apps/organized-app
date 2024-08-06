import { useNavigate } from 'react-router-dom';
import { IconCheckCircle, IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';

const useButtonActions = () => {
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const handleSubmitApplication = async () => {
    try {
      navigate('/');

      await displaySnackNotification({
        header: t('tr_applicationSubmitted'),
        message: t('tr_applicationSubmittedDesc'),
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    handleSubmitApplication,
  };
};

export default useButtonActions;
