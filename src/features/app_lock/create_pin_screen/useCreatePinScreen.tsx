import { useAppTranslation } from '@hooks/index';
import { appLockUpdate } from '@services/app_lock/storage';
import { displaySnackNotification } from '@services/states/app';
import useCreatePin from '../create_pin/useCreatePin';

const clearPinCreateRequest = () =>
  appLockUpdate({ pin_create_pending: false });

const useCreatePinScreen = () => {
  const { t } = useAppTranslation();

  const createPin = useCreatePin('create', clearPinCreateRequest);

  const handleTurnOff = () => {
    clearPinCreateRequest();

    displaySnackNotification({
      header: t('tr_appLockOff'),
      message: t('tr_appLockOffDesc'),
      severity: 'success',
    });
  };

  return { ...createPin, handleTurnOff };
};

export default useCreatePinScreen;
