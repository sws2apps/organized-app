import { useAtomValue } from 'jotai';
import { hallCleaningState, userDataViewState } from '@states/settings';
import type {
  HallCleaningChanges,
  HallCleaningConfig,
} from '@definition/hall_cleaning';
import { saveHallCleaningSettings } from '@services/app/hall_cleaning_settings';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation } from '@hooks/index';

const useHallCleaningSettings = () => {
  const { t } = useAppTranslation();
  const dataView = useAtomValue(userDataViewState);
  const config = useAtomValue(hallCleaningState);

  const handleChange = async (
    changes:
      | HallCleaningChanges
      | ((current: HallCleaningConfig) => HallCleaningChanges)
  ) => {
    try {
      await saveHallCleaningSettings(dataView, changes);
      return true;
    } catch {
      displaySnackNotification({
        header: t('tr_hallCleaningSaveFailed'),
        message: t('tr_hallCleaningSaveFailedDesc'),
        severity: 'error',
      });
      return false;
    }
  };
  return { config, handleChange };
};
export default useHallCleaningSettings;
