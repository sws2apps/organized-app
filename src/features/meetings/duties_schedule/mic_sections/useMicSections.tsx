import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import {
  JWLangState,
  userDataViewState,
  settingsState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import {
  schedulesDutiesMeetingParts,
  schedulesDutiesSections,
} from '@services/app/schedules';
import { DutiesMeetingValue } from '@services/app/duties';

const useMicSections = (week: string, meeting: DutiesMeetingValue) => {
  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);

  // sections belong to the week: schedules drive the refresh after a save
  const sections = useMemo(
    () => schedulesDutiesSections(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules, dataView, settings, sources, lang]
  );

  const parts = useMemo(
    () => schedulesDutiesMeetingParts(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules, sources, lang, dataView]
  );

  const sectionParts = (keys: string[]) =>
    keys
      .map((key) => parts.find((part) => part.key === key)?.label)
      .filter(Boolean)
      .join(', ');

  return {
    sections,
    sectionParts,
    parts,
  };
};

export default useMicSections;
