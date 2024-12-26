import { useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { LANGUAGE_LIST } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { isOnlineState } from '@states/app';
import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from '@services/app/sources';
import { songsBuildList } from '@services/i18n/songs';
import { songsState } from '@states/songs';
import { publicTalksState } from '@states/public_talks';
import { assignmentsHistoryState } from '@states/schedules';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import { schedulesBuildHistoryList } from '@services/app/schedules';

const useSourceLanguage = () => {
  const setSongs = useSetRecoilState(songsState);
  const setPublicTalks = useSetRecoilState(publicTalksState);
  const setAssignmentsHistory = useSetRecoilState(assignmentsHistoryState);

  const value = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const settings = useRecoilValue(settingsState);
  const isOnline = useRecoilValue(isOnlineState);

  const SOURCE_LANGUAGES = useMemo(() => {
    return LANGUAGE_LIST.filter((record) => record.source);
  }, []);

  const value_fullname = useMemo(() => {
    return (
      SOURCE_LANGUAGES.find((record) => record.code.toUpperCase() === value)
        ?.name || ''
    );
  }, [value, SOURCE_LANGUAGES]);

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
        });
      }

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': updateSourceLanguage,
      });

      if (isOnline) {
        const { data, status } = await apiFetchSources();
        if (status === 200 && data?.length) {
          await sourcesImportJW(data);
        }
      }

      const sourceLocale = LANGUAGE_LIST.find(
        (record) => record.code.toUpperCase() === value
      ).locale;

      // reload songs
      const songs = await songsBuildList(sourceLocale);
      setSongs(songs);

      // reload public talks
      const talks = await publicTalksBuildList(sourceLocale);
      setPublicTalks(talks);

      // reload assignment history
      const history = await schedulesBuildHistoryList();
      setAssignmentsHistory(history);
    } catch (error) {
      console.error(error);
    }
  };

  return { SOURCE_LANGUAGES, value, handleChangeLanguage, value_fullname };
};

export default useSourceLanguage;
