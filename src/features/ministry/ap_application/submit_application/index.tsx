import { IconSend } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useSubmitApplication from './useSubmitApplication';
import NavBarButton from '@components/nav_bar_button';

const SubmitApplication = () => {
  const { t } = useAppTranslation();

  const { disabled, handleSubmit, isProcessing } = useSubmitApplication();

  return (
    <NavBarButton
      text={t('tr_btnSubmit')}
      main
      icon={isProcessing ? <IconLoading /> : <IconSend />}
      disabled={disabled || isProcessing}
      onClick={handleSubmit}
    ></NavBarButton>
  );
};

export default SubmitApplication;
