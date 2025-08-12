import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import { MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP } from '@constants/index';
import { schedulesState } from '@states/schedules';
import { settingsState } from '@states/settings';
import { TreasuresPartProps } from './index.types';

const useTreasuresPart = ({ week, dataView }: TreasuresPartProps) => {
  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);

  const classCount = useMemo(() => {
    return (
      settings.cong_settings.midweek_meeting.find(
        (record) => record.type === dataView
      )?.class_count.value ?? 1
    );
  }, [settings, dataView]);

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

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting?.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showAuxClass = useMemo(() => {
    return (
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType)
    );
  }, [classCount, weekType, languageWeekType]);

  return { showAuxClass, weekType };
};

export default useTreasuresPart;
