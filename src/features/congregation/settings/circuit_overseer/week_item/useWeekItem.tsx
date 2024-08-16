import { useRecoilValue } from 'recoil';
import { CircuitOverseerVisitType } from '@definition/settings';
import { settingsState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { getWeekDate } from '@utils/date';
import { schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useWeekItem = (visit: CircuitOverseerVisitType) => {
  const settings = useRecoilValue(settingsState);
  const schedules = useRecoilValue(schedulesState);

  const handleUpdateWeekType = async (weekOf: string, type: Week) => {
    const schedule = schedules.find((record) => record.weekOf === weekOf);

    if (schedule) {
      const midweeks = structuredClone(schedule.midweek_meeting.week_type);

      for (const midweek of midweeks) {
        midweek.value = type;
        midweek.updatedAt = new Date().toISOString();
      }

      const weekends = structuredClone(schedule.weekend_meeting.week_type);

      for (const weekend of weekends) {
        weekend.value = type;
        weekend.updatedAt = new Date().toISOString();
      }

      await dbSchedUpdate(weekOf, {
        'midweek_meeting.week_type': midweeks,
        'weekend_meeting.week_type': weekends,
      });
    }
  };

  const handleDateChange = async (value: Date) => {
    const nextDate =
      value === null ? '' : formatDate(getWeekDate(value), 'yyyy/MM/dd');

    const coVisits = structuredClone(
      settings.cong_settings.circuit_overseer.visits
    );

    let current = coVisits.find((record) => record.id === visit.id);

    if (!current) {
      coVisits.push(visit);

      current = coVisits.find((record) => record.id === visit.id);
    }

    current.weekOf = nextDate;
    current.updatedAt = new Date().toISOString();

    if (value === null) {
      await handleUpdateWeekType(visit.weekOf, Week.NORMAL);
    }

    if (value !== null) {
      await handleUpdateWeekType(visit.weekOf, Week.CO_VISIT);
    }

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.visits': coVisits,
    });
  };

  const handleDeleteVisit = async () => {
    const coVisits = structuredClone(
      settings.cong_settings.circuit_overseer.visits
    );

    const current = coVisits.find((record) => record.id === visit.id);

    if (current) {
      await handleUpdateWeekType(visit.weekOf, Week.NORMAL);

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.visits': coVisits,
    });
  };

  return { handleDateChange, handleDeleteVisit };
};

export default useWeekItem;
