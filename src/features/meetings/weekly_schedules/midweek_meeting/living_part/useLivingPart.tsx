import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { SourceAssignmentType } from '@definition/sources';
import { createNumbersArray } from '@utils/common';
import {
  JWLangState,
  midweekMeetingClosingPrayerLinkedState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { schedulesState } from '@states/schedules';

const useLivingPart = (week: string) => {
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const schedules = useAtomValue(schedulesState);
  const closingPrayerLinked = useAtomValue(
    midweekMeetingClosingPrayerLinkedState
  );

  const parts = useMemo(() => {
    const source = sources.find((record) => record.weekOf === week);

    if (!source) return [];

    const results: SourceAssignmentType[] = [];
    const count = source.midweek_meeting.lc_count.default[lang];

    const array = createNumbersArray(count);
    for (const index of array) {
      const partIndex = `lc_part${index}` as SourceAssignmentType;
      results.push(partIndex);
    }

    const countOverride =
      source.midweek_meeting.lc_count.override.find(
        (record) => record.type === dataView
      )?.value ?? 0;

    if (countOverride > count) {
      results.push('lc_part3');
    }

    return results;
  }, [sources, week, dataView, lang]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  return { parts, weekType, closingPrayerLinked };
};

export default useLivingPart;
