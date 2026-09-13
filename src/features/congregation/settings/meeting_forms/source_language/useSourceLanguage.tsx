import { useAtomValue, useSetAtom } from 'jotai';
import {
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';
import { refreshLocaleDerivedData } from '@services/app/locale_derived_data';
import { syncJWMeetingMaterials } from '@services/app/meeting_materials';

const useSourceLanguage = () => {
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const value = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);

  const refreshAssignmentHistory = () => {
    // load assignment history
    const history = schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  const handleChangeLanguage = async (value: string) => {
    try {
      const updateSourceLanguage = structuredClone(
        settings.cong_settings.source_material.language
      );

      const currentLanguage = updateSourceLanguage.find(
        (record) => record.type === dataView
      );

      if (currentLanguage) {
        currentLanguage.value = value;
        currentLanguage.updatedAt = new Date().toISOString();
      }

      if (!currentLanguage) {
        updateSourceLanguage.push({
          type: 'main',
          value,
          updatedAt: new Date().toISOString(),
          _deleted: false,
        });
      }

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': updateSourceLanguage,
      });

      await refreshLocaleDerivedData();

      refreshAssignmentHistory();

      try {
        await syncJWMeetingMaterials(value);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { value, handleChangeLanguage };
};

export default useSourceLanguage;
