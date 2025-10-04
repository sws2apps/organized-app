import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { settingsState } from '@states/settings';
import { formatDate, getWeekDate } from '@utils/date';
import { CircuitOverseerVisitType } from '@definition/settings';

type WeekRecord = CircuitOverseerVisitType & { isDraft?: boolean };
type WeekErrorType = 'empty' | 'duplicate';

const useWeeksList = () => {
  const settings = useAtomValue(settingsState);

  const [weeks, setWeeks] = useState<WeekRecord[]>([]);
  const [errors, setErrors] = useState<Record<string, WeekErrorType>>({});

  const computeErrors = (
    list: WeekRecord[],
    previous: Record<string, WeekErrorType>
  ) => {
    const nextErrors: Record<string, WeekErrorType> = {};

    for (const record of list) {
      if (record.weekOf.length === 0 && previous?.[record.id] === 'empty') {
        nextErrors[record.id] = 'empty';
      }
    }

    const byWeek = new Map<string, string[]>();

    for (const record of list) {
      if (record.weekOf.length === 0) continue;
      const collection = byWeek.get(record.weekOf) ?? [];
      collection.push(record.id);
      byWeek.set(record.weekOf, collection);
    }

    byWeek.forEach((ids) => {
      if (ids.length > 1) {
        ids.forEach((id) => {
          nextErrors[id] = 'duplicate';
        });
      }
    });

    return nextErrors;
  };

  const updateWeeks = (updater: (previous: WeekRecord[]) => WeekRecord[]) => {
    let nextWeeks: WeekRecord[] = [];
    setWeeks((prev) => {
      const updated = updater(prev);
      nextWeeks = updated;
      return updated;
    });

    setErrors((prevErrors) => computeErrors(nextWeeks, prevErrors));
  };

  const handleAddVisit = () => {
    const existingEmpty = weeks.find((record) => record.weekOf.length === 0);

    if (existingEmpty) {
      setErrors((prev) => ({ ...prev, [existingEmpty.id]: 'empty' }));
      return;
    }

    const draftVisit: WeekRecord = {
      _deleted: false,
      id: crypto.randomUUID(),
      updatedAt: '',
      weekOf: '',
      isDraft: true,
    };

    updateWeeks((prev) => [...prev, draftVisit]);
  };

  const handleWeekChange = (id: string, nextWeekOf: string) => {
    updateWeeks((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              weekOf: nextWeekOf,
              isDraft: nextWeekOf.length === 0 ? record.isDraft : false,
            }
          : record
      )
    );
  };

  const handleVisitDeleted = (id: string) => {
    updateWeeks((prev) => prev.filter((record) => record.id !== id));
  };

  useEffect(() => {
    const upcomingVisits = settings.cong_settings.circuit_overseer.visits.filter(
      (record) =>
        record._deleted === false &&
        (record.weekOf.length === 0 ||
          record.weekOf >= formatDate(getWeekDate(), 'yyyy/MM/dd'))
    );

    let combined: WeekRecord[] = [];

    setWeeks((prev) => {
      const drafts = prev.filter(
        (record) => record.isDraft && !upcomingVisits.some((visit) => visit.id === record.id)
      );

      combined = [...upcomingVisits, ...drafts];

      return combined;
    });

    setErrors((prevErrors) => computeErrors(combined, prevErrors));
  }, [settings]);

  return {
    errors,
    handleAddVisit,
    handleVisitDeleted,
    handleWeekChange,
    weeks,
  };
};

export default useWeeksList;
