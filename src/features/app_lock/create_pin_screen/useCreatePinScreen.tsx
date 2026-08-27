import { useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { appLockCreatePinState } from '@states/app_lock';
import { appLockClearPinCreateRequest } from '@services/app_lock/reset';
import { displaySnackNotification } from '@services/states/app';
import useCreatePin from '../create_pin/useCreatePin';

const useCreatePinScreen = () => {
  const { t } = useAppTranslation();

  const setCreatePin = useSetAtom(appLockCreatePinState);

  const dismiss = () => {
    appLockClearPinCreateRequest();
    setCreatePin(false);
  };

  const createPin = useCreatePin('create', dismiss);

  const handleTurnOff = () => {
    dismiss();

    displaySnackNotification({
      header: t('tr_appLockOff'),
      message: t('tr_appLockOffDesc'),
      severity: 'success',
    });
  };

  return { ...createPin, handleTurnOff };
};

export default useCreatePinScreen;
