import { HallInfo } from '@definition/hall_attendant';
import { store } from '@states/index';
import { userDataViewState } from '@states/settings';
import { dbHallInfoUpdate } from '@services/dexie/hall_attendant';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';

export const updateHallInfo = (
  update: (info: HallInfo, timestamp: string) => void
) => {
  const view = store.get(userDataViewState);
  return dbHallInfoUpdate(view, update)
    .then(() => true)
    .catch((error) => {
      displaySnackNotification({
        header: getTranslation({ key: 'tr_errorTitle' }),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
      return false;
    });
};
