import { useAtomValue, useSetAtom } from 'jotai';
import {
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { refreshLocalesResources } from '@services/i18n';
import { apiFetchSources } from '@services/api/sources';
import { isOnlineState } from '@states/app';
import { sourcesImportJW } from '@services/app/sources';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';
import { dbSongUpdate } from '@services/dexie/songs';
import { dbPublicTalkUpdate } from '@services/dexie/public_talk';

const useSourceLanguage = () => {
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const value = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);
  const isOnline = useAtomValue(isOnlineState);

  const handleSourcesImport = async () => {
    await dbSongUpdate();
    await dbPublicTalkUpdate();

    // load assignment history
    const history = schedulesBuildHistoryList();
    setAssignmentsHistory(history);

    // fetch and add sources
    if (!isOnline) return;

    const { data, status } = await apiFetchSources();

    if (data.length === 0 || status !== 200) return;

    await sourcesImportJW(data);
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

      await refreshLocalesResources();

      await handleSourcesImport();
    } catch (error) {
      console.error(error);
    }
  };

  return { value, handleChangeLanguage };
};

export default useSourceLanguage;
