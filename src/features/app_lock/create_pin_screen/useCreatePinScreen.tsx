import { useAppTranslation } from '@hooks/index';
import { appLockClearPinCreateRequest } from '@services/app_lock/reset';
import { displaySnackNotification } from '@services/states/app';
import useCreatePin from '../create_pin/useCreatePin';

const useCreatePinScreen = () => {
  const { t } = useAppTranslation();

  const createPin = useCreatePin('create', appLockClearPinCreateRequest);

  const handleTurnOff = async () => {
    await appLockClearPinCreateRequest();

    displaySnackNotification({
      header: t('tr_appLockOff'),
      message: t('tr_appLockOffDesc'),
      severity: 'success',
    });
  };

  return { ...createPin, handleTurnOff };
};

export default useCreatePinScreen;
