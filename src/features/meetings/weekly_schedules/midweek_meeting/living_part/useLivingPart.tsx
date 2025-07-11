import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { SourceAssignmentType } from '@definition/sources';
import { createNumbersArray } from '@utils/common';
import { JWLangState, settingsState } from '@states/settings';
import { Week } from '@definition/week_type';
import { schedulesState } from '@states/schedules';
import { MIDWEEK_WITH_CBS } from '@constants/index';
import { LivingPartProps } from './index.types';

const useLivingPart = ({ week, dataView }: LivingPartProps) => {
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);

  const closingPrayerLinked = useMemo(() => {
    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.closing_prayer_linked_assignment.value;
  }, [settings, dataView]);

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

    return (
      schedule.midweek_meeting?.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const mainWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting?.week_type.find(
        (record) => record.type === 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showCBS = useMemo(() => {
    if (dataView === 'main' && weekType === Week.CO_VISIT) {
      return false;
    }

    if (dataView !== 'main' && MIDWEEK_WITH_CBS.includes(weekType)) {
      return mainWeekType !== Week.CO_VISIT;
    }

    return true;
  }, [dataView, weekType, mainWeekType]);

  return { parts, weekType, closingPrayerLinked, showCBS };
};

export default useLivingPart;
