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
import { songsBuildList } from '@services/i18n/songs';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { LANGUAGE_LIST } from '@constants/index';
import { songsState } from '@states/songs';
import { publicTalksState } from '@states/public_talks';
import { assignmentsHistoryState } from '@states/schedules';

const useSourceLanguage = () => {
  const setSongs = useSetAtom(songsState);
  const setPublicTalks = useSetAtom(publicTalksState);
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const value = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);
  const isOnline = useAtomValue(isOnlineState);

  const handleSourcesImport = async (jwLang: string) => {
    const sourceLang =
      LANGUAGE_LIST.find((record) => record.code === jwLang.toLowerCase())
        ?.threeLettersCode ?? 'eng';

    // load songs
    const songs = songsBuildList(sourceLang);
    setSongs(songs);

    // load public talks
    const talks = publicTalksBuildList(sourceLang);
    setPublicTalks(talks);

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

      await handleSourcesImport(value);
    } catch (error) {
      console.error(error);
    }
  };

  return { value, handleChangeLanguage };
};

export default useSourceLanguage;
