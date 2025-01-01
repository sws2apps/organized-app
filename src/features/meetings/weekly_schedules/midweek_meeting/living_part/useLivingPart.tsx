import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { SourceAssignmentType } from '@definition/sources';
import { createNumbersArray } from '@utils/common';
import { sourcesCountLC } from '@services/app/sources';
import {
  JWLangState,
  midweekMeetingClosingPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { schedulesState } from '@states/schedules';

const useLivingPart = (week: string) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const schedules = useRecoilValue(schedulesState);
  const closingPrayerAuto = useRecoilValue(
    midweekMeetingClosingPrayerAutoAssign
  );

  const parts = useMemo(() => {
    const source = sources.find((record) => record.weekOf === week);

    if (!source) return [];

    const results: SourceAssignmentType[] = [];
    const count = sourcesCountLC(source, dataView, lang);

    const array = createNumbersArray(count);
    for (const index of array) {
      const partIndex = `lc_part${index}` as SourceAssignmentType;
      results.push(partIndex);
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

  return { parts, weekType, closingPrayerAuto };
};

export default useLivingPart;
