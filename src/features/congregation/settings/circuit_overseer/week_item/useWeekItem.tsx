import { useAtomValue } from 'jotai';
import { CircuitOverseerVisitType } from '@definition/settings';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { formatDate, getWeekDate } from '@utils/date';
import { schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useWeekItem = (visit: CircuitOverseerVisitType) => {
  const settings = useAtomValue(settingsState);
  const schedules = useAtomValue(schedulesState);

  const handleUpdateWeekType = async (weekOf: string, type: Week) => {
    if (!weekOf) return;

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

  const hasAnotherVisitWithWeek = (
    list: CircuitOverseerVisitType[],
    weekOf: string,
    currentId: string
  ) => {
    if (!weekOf) return false;
    return list.some(
      (record) =>
        record.id !== currentId && record._deleted === false && record.weekOf === weekOf
    );
  };

  const handleDateChange = async (value: Date | null) => {
    const nextDate =
      value === null ? '' : formatDate(getWeekDate(value), 'yyyy/MM/dd');

    const coVisits = structuredClone(
      settings.cong_settings.circuit_overseer.visits
    );

    let current = coVisits.find((record) => record.id === visit.id);

    if (!current) {
      coVisits.push({
        _deleted: visit._deleted,
        id: visit.id,
        updatedAt: visit.updatedAt,
        weekOf: visit.weekOf,
      });

      current = coVisits.find((record) => record.id === visit.id);
    }

    const previousWeek = current?.weekOf ?? '';

    current.weekOf = nextDate;
    current.updatedAt = new Date().toISOString();

    if (previousWeek && previousWeek !== nextDate) {
      const stillHasPreviousWeek = hasAnotherVisitWithWeek(
        coVisits,
        previousWeek,
        visit.id
      );

      if (!stillHasPreviousWeek) {
        await handleUpdateWeekType(previousWeek, Week.NORMAL);
      }
    }

    if (nextDate.length > 0) {
      await handleUpdateWeekType(nextDate, Week.CO_VISIT);
    }

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.visits': coVisits,
    });

    return nextDate;
  };

  const handleDeleteVisit = async () => {
    const coVisits = structuredClone(
      settings.cong_settings.circuit_overseer.visits
    );

    const current = coVisits.find((record) => record.id === visit.id);

    if (current) {
      const currentWeek = current.weekOf;

      if (currentWeek) {
        const stillHasWeek = hasAnotherVisitWithWeek(
          coVisits,
          currentWeek,
          visit.id
        );

        if (!stillHasWeek) {
          await handleUpdateWeekType(currentWeek, Week.NORMAL);
        }
      }

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
