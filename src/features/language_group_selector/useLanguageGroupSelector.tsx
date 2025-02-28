import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { songsBuildList } from '@services/i18n/songs';
import {
  congNameState,
  languageGroupEnabledState,
  languageGroupsState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { songsState } from '@states/songs';
import { Option } from './index.types';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import { publicTalksState } from '@states/public_talks';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';
import { LANGUAGE_LIST } from '@constants/index';

const useGroupLanguageSelector = () => {
  const { t } = useAppTranslation();

  const ref = useRef<HTMLDivElement>(undefined);

  const { person } = useCurrentUser();

  const setSongs = useSetRecoilState(songsState);
  const setPublicTalks = useSetRecoilState(publicTalksState);
  const setAssignmentsHistory = useSetRecoilState(assignmentsHistoryState);

  const languageGroupEnabled = useRecoilValue(languageGroupEnabledState);
  const languageGroups = useRecoilValue(languageGroupsState);
  const congName = useRecoilValue(congNameState);
  const value = useRecoilValue(userDataViewState);
  const settings = useRecoilValue(settingsState);

  const display = useMemo(() => {
    if (!languageGroupEnabled) return false;

    if (Array.isArray(person.person_data.categories)) {
      return false;
    }

    if (
      person.person_data.categories.value.length === 1 &&
      person.person_data.categories.value.includes('main')
    ) {
      return false;
    }

    return languageGroups.length > 0;
  }, [languageGroups, languageGroupEnabled, person]);

  const options = useMemo(() => {
    if (!display) return [];

    const result: Option[] = [{ icon: 'main', value: 'main', label: congName }];

    for (const group of languageGroups) {
      result.push({ icon: 'group', value: group.id, label: group.name });
    }

    return result.sort((a, b) => a.label.localeCompare(b.label));
  }, [display, congName, languageGroups]);

  const renderValue = (value: string) => {
    if (value === 'main') return t('tr_hostCongregation');

    return options.find((record) => record.value === value).label;
  };

  const handleChange = async (value: string) => {
    await dbAppSettingsUpdate({ 'user_settings.data_view': value });

    let language: string;

    if (value === 'main') {
      const source =
        settings.cong_settings.source_material.language.find(
          (record) => record.type === 'main'
        )?.value || 'E';

      language =
        LANGUAGE_LIST.find(
          (record) => record.code.toLowerCase() === source.toLowerCase()
        )?.threeLettersCode || 'eng';
    } else {
      const group = languageGroups.find((record) => record.id === value);

      language =
        LANGUAGE_LIST.find(
          (record) => record.code.toLowerCase() === group.language.toLowerCase()
        )?.threeLettersCode || 'eng';
    }

    // load songs
    const songs = songsBuildList(language);
    setSongs(songs);

    // load public talks
    const talks = publicTalksBuildList(language);
    setPublicTalks(talks);

    // load assignment history
    const history = await schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  useEffect(() => {
    const fieldset = ref.current?.querySelector('fieldset');

    if (fieldset) {
      fieldset.style.borderRadius = 'var(--radius-max) !important';
      fieldset.style.borderColor = 'var(--accent-200) !important';
      fieldset.classList.add('big-card-shadow');
    }
  }, []);

  return { ref, display, options, value, renderValue, handleChange };
};

export default useGroupLanguageSelector;
