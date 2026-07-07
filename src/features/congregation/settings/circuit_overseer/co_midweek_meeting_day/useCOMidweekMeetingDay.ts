import { settingSchema } from '@services/dexie/schema';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { generateWeekday } from '@services/i18n/translation';
import {
  COMidweekMeetingDayState,
  firstDayWeekState,
  settingsState,
} from '@states/settings';
import { shiftWeekday, unshiftWeekday } from '@utils/date';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

const useCOMidweekMeetingDay = () => {
  const settings = useAtomValue(settingsState);
  const firstDayWeek = useAtomValue(firstDayWeekState);
  const optionalInitial = useAtomValue(COMidweekMeetingDayState);

  const [visitDay, setVisitDay] = useState(2);

  const normalizedVisitDay = useMemo(
    () => shiftWeekday(visitDay, firstDayWeek),
    [visitDay, firstDayWeek]
  );

  const weekdays = useMemo(() => {
    const days = generateWeekday();
    const shift = (firstDayWeek + 6) % 7;

    return [...days.slice(shift), ...days.slice(0, shift)];
  }, [firstDayWeek]);

  const handleVisitDayChange = async (value: number) => {
    const initialData =
      settings.cong_settings.circuit_overseer.midweek_meeting_day ||
      settingSchema.cong_settings.circuit_overseer.midweek_meeting_day;

    const current = structuredClone(initialData);

    current.value = unshiftWeekday(value, firstDayWeek);
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.midweek_meeting_day': current,
    });
  };

  useEffect(() => {
    setVisitDay(optionalInitial);
  }, [optionalInitial]);

  return { normalizedVisitDay, weekdays, handleVisitDayChange };
};

export default useCOMidweekMeetingDay;
