import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { getWeekDate } from '@utils/date';
import { CircuitOverseerVisitType } from '@definition/settings';

const useWeeksList = () => {
  const settings = useRecoilValue(settingsState);

  const [weeks, setWeeks] = useState<CircuitOverseerVisitType[]>([]);

  const handleAddVisit = () => {
    setWeeks((prev) => {
      const obj: CircuitOverseerVisitType = {
        _deleted: false,
        id: crypto.randomUUID(),
        updatedAt: '',
        weekOf: '',
      };

      return [...prev, obj];
    });
  };

  useEffect(() => {
    const weeks = settings.cong_settings.circuit_overseer.visits.filter(
      (record) =>
        record._deleted === false &&
        (record.weekOf.length === 0 ||
          record.weekOf >= formatDate(getWeekDate(), 'yyyy/MM/dd'))
    );

    setWeeks(weeks);
  }, [settings]);

  return { weeks, handleAddVisit };
};

export default useWeeksList;
